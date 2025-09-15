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
import DateTimeInput from './DateTimeInput';

export const AdminTab = () => {
  const { wallets } = useWallets();
  const connectedAddress = wallets[0]?.address?.toLowerCase();
  const [isLoading, setIsLoading] = useState(false);
  const { address: activeAddress } = useAccount();
  
  // Helper function to convert dd-mm-yyyy, hh:mm:ss to Unix timestamp
  const convertToUnixTimestamp = (dateTimeString: string): string => {
    if (!dateTimeString) return "0";
    
    try {
      // Parse format: dd-mm-yyyy, hh:mm:ss
      const [datePart, timePart] = dateTimeString.split(', ');
      const [day, month, year] = datePart.split('-').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      
      // Create date object (JavaScript Date constructor expects month-1)
      // JavaScript automatically handles DST for the target date
      const date = new Date(year, month - 1, day, hours, minutes, seconds);
      
      // Convert to UTC timestamp
      return Math.floor(date.getTime() / 1000).toString();
    } catch (error) {
      console.error('Error parsing datetime:', error);
      return "0";
    }
  };

  // Helper function to convert Unix timestamp to local date format
  const formatUnixTimestampToLocal = (unixTimestamp: string): string => {
    if (!unixTimestamp || unixTimestamp === "0") return "Invalid date";
    
    try {
      const timestamp = parseInt(unixTimestamp) * 1000; // Convert to milliseconds
      const date = new Date(timestamp);
      
      // Format: "Mo, 14 Aug 2025, 10:00 PM (CET, UTC+1)"
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'longOffset'
      };
      
      return date.toLocaleString('en-US', options);
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return "Invalid date";
    }
  };

  const [formData, setFormData] = useState({
    referenceAsset: "https://ipfs.io/ipfs/bafybeidtxi5d2u4cr2l6nujfksbfzgapbnv44vxk5tgtgflifutigtrtla/reference_asset_kajiado.json",
    expiryTime: "0", // Will be set when user enters datetime
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

  // State for the datetime input (local time) - starts empty
  const [expiryDateTime, setExpiryDateTime] = useState("");

  // Handle datetime change and update both local state and form data
  const handleDateTimeChange = (dateTimeString: string) => {
    setExpiryDateTime(dateTimeString);
    const unixTimestamp = convertToUnixTimestamp(dateTimeString);
    setFormData(prev => ({
      ...prev,
      expiryTime: unixTimestamp
    }));
  };

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
          <label className="block text-sm font-medium text-gray-700">
            Expiry Time (Local Time)
            <div className="inline-block ml-2 relative group">
              <svg 
                className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-80 z-10">
                <div className="space-y-2">
                  <div><strong>DST Note:</strong> The time you enter (e.g., 14:00) will always be 14:00 in your local timezone. The system automatically adjusts UTC conversion for daylight saving time transitions.</div>
                  <div><strong>Example:</strong> If you set 15-11-2024, 14:00:00, it will be 14:00 CET (UTC+1) in November, but if you set 15-07-2024, 14:00:00, it will be 14:00 CET (UTC+2) in July.</div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </label>
          <div className="mt-1">
            <DateTimeInput
              value={expiryDateTime}
              onChange={handleDateTimeChange}
              className="border border-gray-300 rounded-md p-2 bg-white"
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatUnixTimestampToLocal(formData.expiryTime)} | Unix timestamp: {formData.expiryTime}
          </div>
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