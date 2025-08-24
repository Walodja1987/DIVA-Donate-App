'use client';

// Nextjs
import Image from 'next/image'

// React
import React, { useEffect, useState } from 'react'

// Hooks
import { useDisclosure } from '@chakra-ui/react'
import { useDebounce } from '../../utils/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'
import { queryCampaignStats } from '@/queries/divaSubgraph'

// Components
import { DonationCard } from './DonationCard'

// viem
import { formatUnits, parseUnits } from 'viem'

// ABIs
import { DivaABI, DivaABIold, ERC20ABI } from '@/abi'

// Privy
import { usePrivy, useWallets } from '@privy-io/react-auth';

// constants
import { divaContractAddressOld } from '../../constants'

// Utils
import { formatDate, isExpired, isUnlimited } from '../../utils/general'

// Types
import type { Campaign, CampaignPool } from '@/types/campaignTypes'
import type { PoolExtended } from '@/types/poolTypes'

// Wagmi
import { wagmiConfig } from '@/components/wagmiConfig'
import { useAccount } from 'wagmi'
import { 
	simulateContract,
	readContract,
	writeContract,
	waitForTransactionReceipt,
	getChains,
} from '@wagmi/core'


const DonationExpiredInfo = () => {
	return (
		<div className="h-[403px] lg:h-[660px] justify-evenly p-[30px] lg:p-[60px] flex items-center w-full">
			<div className="text-2xl font-bold font-lora text-center opacity-70">
				This campaign has expired. Stayed tuned for the next one.
			</div>
		</div>
	)
}

// @todo at the bottom, align the Please connect to Polygon message with the component on the CampaignSection page

const FortuneDiva: React.FC<{
	expiryTimeInMilliseconds: number
	campaign: Campaign
}> = ({ expiryTimeInMilliseconds, campaign }) => {
	// Set the date format to "Jun 10, 2023, 11 PM GMT + 1"
	const expiryTime = formatDate(expiryTimeInMilliseconds)

	return (
		campaign && (
			<div className="mx-auto xl:w-[500px] 2xl:w-[732px] lg:mt-0 lg:col-span-4 lg:flex">
				<div
					className={`sm-bg-auto h-[403px] lg:h-[660px] bg-cover bg-center bg-no-repeat rounded-[20px]`}
					style={{ backgroundImage: `url('${campaign?.img}')` }}>
					<div className="relative py-6 lg:py-12 lg:px-10 px-4 text-[#DEEFE7] h-full flex flex-col justify-end gap-2">
						{/* todo: improve the green bar on mobile */}
						<div className="absolute w-full bottom-0 left-0 h-56 sm:h-52 bg-[#005C53]/75 rounded-bl-[20px] rounded-br-[20px]"></div>
						<h5 className="font-semibold text-2xl 2xl:text-4xl font-['lora'] z-[9]">
							{campaign?.title}
						</h5>
						<p className="card-text text-sm font-openSans z-[9]">
							{campaign?.desc}
						</p>
						<span className="text-sm text-[#DBF227] align-middle font-lora flex gap-2 items-center z-[9]">
							<Image src="/Images/fi-sr-hourglass-end.svg" alt="hourglass" width={20} height={20} />
							<div>
								<b>Expiry:</b> {expiryTime}
							</div>
						</span>
					</div>
				</div>
			</div>
		)
	)
}

/**
 * @notice The upper section including the donation widget on individual campaign pages
 */
export const CampaignCard: React.FC<{
	campaign: Campaign
	thankYouMessage: string
}> = ({ campaign, thankYouMessage }) => {
	const [balance, setBalance] = useState<number>(0)
	const [amount, setAmount] = useState<string>('')
	const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false)
	const [goal, setGoal] = useState<number | 'Unlimited'>(0)
	const [raised, setRaised] = useState<number>(0)
	const [toGo, setToGo] = useState<number | 'Unlimited'>(0)
	const [percentage, setPercentage] = useState<number>(0)
	const [approveEnabled, setApproveEnabled] = useState<boolean>(false)
	const [approveLoading, setApproveLoading] = useState<boolean>(false)
	const [donateEnabled, setDonateEnabled] = useState<boolean>(false)
	const [donateLoading, setDonateLoading] = useState<boolean>(false)
	const [isApproveSuccessOpen, setIsApproveSuccessOpen] = useState(false)
	
	// Privy hooks
	const { connectWallet } = usePrivy();
	const { wallets } = useWallets();
	const wallet = wallets[0] // active/connected wallet
	
	// WAGMI hooks
	const { address: activeAddress, isConnected, chain, chainId } = useAccount()

	// More efficient to simply store the decimals in `campaigns.json` rather than doing an RPC request
	const decimals = Number(campaign.decimals)

	// Get the name of the campaign chain to display in the switch wallet message inside the DonationCard component
	const chains = getChains(wagmiConfig)
	const campaignChainId = Number(campaign.chainId)
	const campaignChainName = chains.find((chain) => chain.id === campaignChainId)?.name

	const expiryTime = Number(campaign.expiryTimestamp) * 1000;

	// Contracts
	const collateralTokenContract = {
		address: campaign.collateralToken,
		abi: ERC20ABI,
		chainId: campaignChainId as 137 | 42161 | 1,
	} as const

	const divaContract = {
		address: campaign.divaContractAddress,
		abi: campaign.divaContractAddress === divaContractAddressOld && campaignChainId === 137
			? DivaABIold
			: DivaABI,
		chainId: campaignChainId as 137 | 42161 | 1,
	} as const

	const debouncedAmount = useDebounce(amount, 300)

	const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })

	// if (!ready) {
	// 	// Do nothing while the PrivyProvider initializes with updated user state
	// 	console.log('PrivyProvider not ready')
	//   return null;
	// }

	// if (ready && !authenticated) {
	// 	// Replace this code with however you'd like to handle an unauthenticated user
	// 	// As an example, you might redirect them to a login page
	// 	// router.push('/login');
	// }

	// if (ready && !authenticated) {
	// 	// Replace this code with however you'd like to handle an unauthenticated user
	// 	// As an example, you might redirect them to a login page
	// 	// router.push('/login');
	// }

	const handleSwitchNetwork = async (campaignChainId: number) => {
		try {
		  await wallet.switchChain(campaignChainId);
		  // Optionally, you can add a success message or trigger a state update here
		  console.log(`Successfully switched to chain ${campaignChainId}`);
		} catch (error) {
		  if (error instanceof Error) {
			// Check if the error is due to the user rejecting the request
			if (error.message.includes('User rejected the request')) {
			  console.log('User rejected the network switch');
			  // You can show a user-friendly message here, e.g., using a toast notification
			  // toast.error('Network switch was cancelled. Please try again to interact with this campaign.');
			} else {
			  console.error('Error switching network:', error.message);
			  // Handle other types of errors
			  // toast.error('Failed to switch network. Please try again.');
			}
		  } else {
			console.error('An unknown error occurred while switching network');
			// toast.error('An unexpected error occurred. Please try again.');
		  }
		}
	  };
	
	const checkAllowanceAndBalance = async () => {
		// Replace commas in the `amount` string with dots to match desired format (e.g., 7.31 instead of 7,31)
		const sanitized = debouncedAmount?.replace(/,/g, '.')

		// Proceed if entered amount is greater than 0 and collateral token contract is defined
		if (Number(sanitized) > 0 && collateralTokenContract != null) {
		  const allowance = await readContract(wagmiConfig, {
			...collateralTokenContract,
			functionName: 'allowance',
			args: [activeAddress, campaign.divaContractAddress],
		  }) as bigint
	
		  // Check for insufficient funds
		  const hasInsufficientFunds = Number(sanitized) > balance
		  setInsufficientFunds(hasInsufficientFunds)
	
		  // Update approve and donate states if funds are sufficient.
		  // In particular handles the scenario where the entered amount renders funds to be insufficient
		  // but the user then changes the amount to a value that is sufficient.
		  if (!hasInsufficientFunds) {
			  if (allowance >= parseUnits(sanitized, decimals)) {
				setApproveEnabled(false)
				setDonateEnabled(true)
			  } else {
				setApproveEnabled(true)
				setDonateEnabled(false)
			  }
			} else {
			  setApproveEnabled(false)
			  setDonateEnabled(false)
			}
		  } else {
			setInsufficientFunds(false)
			setApproveEnabled(false)
			setDonateEnabled(false)
		  }
	  }

	// Check user allowance and enable/disable the Approve and Donate buttons accordingly
	useEffect(() => {
		if (chain) {
		  if (chainId === campaignChainId && activeAddress != null) {
			checkAllowanceAndBalance()
		  }
		}
	  }, [
		activeAddress,
		debouncedAmount,
		chain,
		balance
	  ])

	// Inside the CampaignCard component, add the query
	const { data: statsData, isLoading: statsLoading } = useQuery({
		queryKey: ['campaignStats', campaign.pools.map(pool => pool.poolId)],
		queryFn: async () => {
			const response = await request(
				chainConfigs[Number(campaign.chainId)].graphUrl,
				queryCampaignStats(campaign.pools.map(pool => pool.poolId))
			);
			return response.pools;
		}
	});

	// Replace the existing stats-related useEffect with this one
	useEffect(() => {
		if (statsData) {
			let sumCapacityPools: number | 'Unlimited' = 0;
			let sumRaisedPools: number = 0;

			statsData.forEach((pool: any) => {
				// Calculate totals
				if (isUnlimited(pool.capacity)) {
					sumCapacityPools = 'Unlimited';
				} else if (sumCapacityPools !== 'Unlimited') {
					sumCapacityPools += Number(formatUnits(pool.capacity, decimals));
				}
				sumRaisedPools += Number(formatUnits(pool.collateralBalance, decimals));
			});

			// Apply overrides from campaign data
			if (campaign.goal !== '') {
				sumCapacityPools = Number(campaign.goal);
			}
			if (campaign.raised !== '') {
				sumRaisedPools = Number(campaign.raised);
			}

			// Update states
			setGoal(sumCapacityPools);
			setRaised(sumRaisedPools);
			setToGo(sumCapacityPools === 'Unlimited' ? 'Unlimited' : sumCapacityPools - sumRaisedPools);
			setPercentage(sumCapacityPools === 'Unlimited' ? 0 : (sumRaisedPools / sumCapacityPools) * 100);
		}
	}, [statsData, campaign]);

	const handleApprove = async () => {
		setApproveLoading(true)
		try {
			// First, simulate the contract call. That's the recommended practice in the viem docs:
			// https://viem.sh/docs/contract/writeContract.html#usage
			const { request } = await simulateContract(wagmiConfig, {
				...collateralTokenContract,
				functionName: 'approve',
				args: [campaign.divaContractAddress, parseUnits(amount, decimals) + BigInt(10)],
				account: activeAddress,
			})
	
			// If simulation is successful, proceed with the actual transaction
			const hash = await writeContract(wagmiConfig, request as any)
	
			// Wait for the transaction to be mined
			await waitForTransactionReceipt(wagmiConfig, { hash })
	
			setApproveEnabled(false)
			setDonateEnabled(true)
			setApproveLoading(false)
			setIsApproveSuccessOpen(true)
		} catch (err) {
			console.error('Error in approve transaction:', err)
			setApproveLoading(false)
		}
	}

	const handleDonation = async () => {
		if (amount != null) {
			setDonateLoading(true)
	
			try {
				// Fetch capacities
				const capacities = await Promise.all(
					campaign.pools.map((pool) =>
						readContract(wagmiConfig, {
							...divaContract,
							functionName: 'getPoolParameters',
							args: [pool.poolId as any],
						}).then((res: any) => res.capacity)
					)
				)
	
				const sumCapacity = capacities.reduce(
					(acc, capacity) => acc + BigInt(capacity),
					BigInt(0)
				)
	
				// Prepare args for `batchAddLiquidity` smart contract call
				const batchAddLiquidityArgs = campaign.pools.map((pool, index) => {
					const collateralAmountIncr = parseUnits(amount.toString(), decimals)
						* BigInt(capacities[index])
						/ BigInt(sumCapacity)
	
					return {
						poolId: pool.poolId,
						collateralAmountIncr: collateralAmountIncr,
						longRecipient:
							pool.beneficiarySide === 'short'
								? activeAddress
								: campaign.donationRecipients[0].address,
						shortRecipient:
							pool.beneficiarySide === 'short'
								? campaign.donationRecipients[0].address
								: activeAddress,
					}
				})
	
				// First, simulate the contract call. That's the recommended practice in the viem docs:
				// https://viem.sh/docs/contract/writeContract.html#usage
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore: Temporarily ignore type error, fix later
				const { request } = await simulateContract(wagmiConfig, {
					...divaContract,
					functionName: 'batchAddLiquidity',
					args: [batchAddLiquidityArgs],
					account: activeAddress,
				})
				                // Convert BigInt values to strings before logging
								const serializedArgs = batchAddLiquidityArgs.map(arg => ({
									...arg,
									collateralAmountIncr: arg.collateralAmountIncr.toString()
								}))
								console.log("batchAddLiquidityArgs", JSON.stringify(serializedArgs, null, 2))
	
				// If simulation is successful, proceed with the actual transaction
				const hash = await writeContract(wagmiConfig, request)
	
				// Wait for the transaction to be mined
				await waitForTransactionReceipt(wagmiConfig, { hash })
	
				setDonateLoading(false)
				setAmount('') // Reset amount after successful donation
				checkAllowanceAndBalance()
				onOpen() // Open Success Modal
			} catch (err) {
				console.error('Error in batchAddLiquidity transaction:', err)
				setDonateLoading(false)
			}
		}
	}

	// const handleMax = () => {
	// 	if (balance != null) {
	// 		setAmount(balance.toString())
	// 	}
	// }
	const handleAmountChange = (e: any) => {
		setAmount(e.target.value)
	}

	useEffect(() => {
		const getBalance = async () => {
			if (activeAddress) {
				const result = await readContract(wagmiConfig, {
					...collateralTokenContract,
					functionName: 'balanceOf',
					args: [activeAddress],
				}) as bigint
				const tokenAmount = Number(formatUnits(result, decimals))
				console.log("tokenAmount", tokenAmount)
				setBalance(tokenAmount)
			}
		}

	// @todo check this part as the useEffect block was dissolved and I think it's causing some issues
		if (chain && chainId === campaignChainId && activeAddress != null) {
			getBalance()
		}
	}, [
		chain,
		activeAddress,
		donateLoading
	])

	return (
		<div className="bg-[#F3FDF8] w-full pb-12 flex justify-center pt-32 lg:pt-16">
			<div className="px-4 xl:px-0 gap-6 lg:py-16  flex flex-col lg:flex-row max-w-screen-2xl">
				<FortuneDiva
					expiryTimeInMilliseconds={expiryTime}
					campaign={campaign}
				/>
				<div className="flex-col">
					<div className="mx-auto pb-12 lg:pb-0 bg-[#FFFFFF] border border-gray-200 rounded-[26px] drop-shadow-xl">
						{isExpired(expiryTime) ? (
							<DonationExpiredInfo />
						) : (
							<DonationCard
								thankYouMessage={thankYouMessage}
								isConnected={isConnected}
								connectedChainId={Number(chainId)}
								campaignChainId={Number(campaignChainId)}
								campaignChainName={campaignChainName ?? "Unknown Chain"}
								isOpen={isOpen}
								onClose={onClose}
								percentage={percentage}
								goal={goal}
								raised={raised}
								amount={amount}
								handleAmountChange={handleAmountChange}
								balance={balance}
								insufficientFunds={insufficientFunds}
								campaign={campaign}
								approveLoading={approveLoading}
								handleApprove={handleApprove}
								toGo={toGo}
								approveEnabled={approveEnabled}
								donateLoading={donateLoading}
								handleDonation={handleDonation}
								donateEnabled={donateEnabled}
								openConnectModal={connectWallet}
								handleSwitchNetwork={handleSwitchNetwork}
								isApproveSuccessOpen={isApproveSuccessOpen}
								onApproveSuccessClose={() => setIsApproveSuccessOpen(false)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
