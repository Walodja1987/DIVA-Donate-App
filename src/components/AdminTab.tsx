import { useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { ADMIN_ADDRESS, divaContractAddress } from '../constants';
import { parseUnits } from "viem";
import { DivaABI, ERC20ABI } from '../abi';
import { useAccount } from 'wagmi';
import { 
  simulateContract,
  writeContract,
  waitForTransactionReceipt,
  readContract,
} from '@wagmi/core';
import { wagmiConfig } from '../components/wagmiConfig';

export const AdminTab = () => {
  const { wallets } = useWallets();
  const connectedAddress = wallets[0]?.address?.toLowerCase();
  const [isLoading, setIsLoading] = useState(false);
  const { address: activeAddress } = useAccount();
  
  const [formData, setFormData] = useState({
    referenceAsset: "https://ipfs.io/ipfs/bafybeidtxi5d2u4cr2l6nujfksbfzgapbnv44vxk5tgtgflifutigtrtla/reference_asset_kajiado.json",
    expiryTime: "1749272400",
    floor: "1.50",
    inflection: "1.56", 
    cap: "1.56",
    gradient: "1",
    collateralAmount: "0",
    collateralToken: "0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD",
    dataProvider: "0x314b0EfcACFD9A9fb7b7834B2a7e47d6325eca23",
    capacity: "",
    longRecipient: "0xd288B4A23ECc79Eb4bb4661147f3AB3294919F54",
    shortRecipient: "0x314b0EfcACFD9A9fb7b7834B2a7e47d6325eca23"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!activeAddress) throw new Error("No wallet connected");

      // Define contracts
      const collateralTokenContract = {
        address: formData.collateralToken as `0x${string}`, // Type assertion for address
        abi: ERC20ABI,
        chainId: 1,
      } as const;

      const divaContract = {
        address: divaContractAddress as `0x${string}`, // Type assertion for address
        abi: DivaABI,
        chainId: 1,
      } as const;

      // Parse input values
      const floor = parseUnits(formData.floor, 18);
      const inflection = parseUnits(formData.inflection, 18);
      const cap = parseUnits(formData.cap, 18);
      const gradient = parseUnits(formData.gradient, 18);
      const collateralAmount = parseUnits(formData.collateralAmount, 18);
      const capacity = formData.capacity ? parseUnits(formData.capacity, 18) : parseUnits("115792089237316195423570985008687907853269984665640564039457584007913129639935", 0);

      // Check allowance
      const allowance = await readContract(wagmiConfig, {
        ...collateralTokenContract,
        functionName: 'allowance',
        args: [activeAddress as `0x${string}`, divaContractAddress as `0x${string}`],
      });

      // Approve if needed
      if (allowance < collateralAmount) {
        console.log("Approving tokens...");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { request } = await simulateContract(wagmiConfig, {
          ...collateralTokenContract,
          functionName: 'approve',
          args: [divaContractAddress as `0x${string}`, collateralAmount],
          account: activeAddress,
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const hash = await writeContract(wagmiConfig, request);
        await waitForTransactionReceipt(wagmiConfig, { hash });
        console.log("Tokens approved");
      }

      // Create pool
      console.log("Creating pool...");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { request } = await simulateContract(wagmiConfig, {
        ...divaContract,
        functionName: 'createContingentPool',
        args: [[
          formData.referenceAsset,
          BigInt(formData.expiryTime),
          floor,
          inflection,
          cap,
          gradient,
          collateralAmount,
          formData.collateralToken as `0x${string}`,
          formData.dataProvider as `0x${string}`,
          capacity,
          formData.longRecipient as `0x${string}`,
          formData.shortRecipient as `0x${string}`,
          "0x0000000000000000000000000000000000000000" as `0x${string}`,
        ]],
        account: activeAddress,
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const hash = await writeContract(wagmiConfig, request);
      console.log("Transaction sent:", hash);

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });
      console.log("Transaction confirmed:", receipt);

    } catch (error) {
      console.error("Error creating pool:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (connectedAddress !== ADMIN_ADDRESS) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create Contingent Pool</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Reference Asset</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.referenceAsset}
            onChange={(e) => setFormData({...formData, referenceAsset: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Time (UNIX)</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.expiryTime}
            onChange={(e) => setFormData({...formData, expiryTime: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Floor</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.floor}
              onChange={(e) => setFormData({...formData, floor: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Inflection</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.inflection}
              onChange={(e) => setFormData({...formData, inflection: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cap</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.cap}
              onChange={(e) => setFormData({...formData, cap: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gradient</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.gradient}
              onChange={(e) => setFormData({...formData, gradient: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Collateral Amount</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.collateralAmount}
              onChange={(e) => setFormData({...formData, collateralAmount: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data Provider</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.dataProvider}
            onChange={(e) => setFormData({...formData, dataProvider: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Collateral Token Address</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.collateralToken}
            onChange={(e) => setFormData({...formData, collateralToken: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Long Recipient</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.longRecipient}
              onChange={(e) => setFormData({...formData, longRecipient: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Short Recipient</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.shortRecipient}
              onChange={(e) => setFormData({...formData, shortRecipient: e.target.value})}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`
            px-4 py-2 rounded
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {isLoading ? 'Creating Pool...' : 'Create Pool'}
        </button>
      </form>
    </div>
  );
}; 