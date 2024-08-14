'use client';

// React
import React, { useEffect, useState } from 'react'

// Hooks
import { useERC20Contract } from '../../utils/hooks/useContract'
import { useDisclosure } from '@chakra-ui/react'
import { useDebounce } from '../../utils/hooks/useDebounce'

// Components
import { DonationCard } from './DonationCard'

// Ethers
import { ethers } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

// ABIs
import { DivaABI, DivaABIold, ERC20ABI } from '@/abi'

// Privy
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSetActiveWallet } from '@privy-io/wagmi';

// constants
import { chainConfig } from '../../constants'
import { divaContractAddressOld } from '../../constants'

// Utils
import { formatDate, isExpired, isUnlimited } from '../../utils/general'
import { getTokenBalance } from '../../utils/general'

// Types
import { Campaign, CampaignPool } from '../../types/campaignTypes'
import { PoolExtended } from '../../types/poolTypes'

// Wagmi
import { wagmiConfig } from '@/components/wagmiConfig'
import { useAccount, useSwitchChain, useEstimateFeesPerGas } from 'wagmi'
import { readContract, writeContract } from '@wagmi/core'


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
							<img src="/Images/fi-sr-hourglass-end.svg" alt="hourglass" />
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
	const { data } = useEstimateFeesPerGas({ chainId: chainConfig.chainId })
	const [amount, setAmount] = useState<string>('')
	const [goal, setGoal] = useState<number | 'Unlimited'>(0)
	const [raised, setRaised] = useState<number>(0)
	const [toGo, setToGo] = useState<number | 'Unlimited'>(0)
	const [percentage, setPercentage] = useState<number>(0)
	const [approveEnabled, setApproveEnabled] = useState<boolean>(false)
	const [approveLoading, setApproveLoading] = useState<boolean>(false)
	const [donateEnabled, setDonateEnabled] = useState<boolean>(false)
	const [donateLoading, setDonateLoading] = useState<boolean>(false)
	const [expiryTime, setExpiryTime] = useState<number>(Number(campaign.expiryTimestamp) * 1000)

	// Privy hooks
	const {ready, user, authenticated, login, connectWallet, logout, linkWallet} = usePrivy();
	const {wallets, ready: walletsReady} = useWallets();
	
	// WAGMI hooks
	const { address: activeAddress, isConnected, chain } = useAccount()  // @todo consider using chainId directly instead of loading full chain object including chain.id if only id is used
	// const collateralTokenContract = useERC20Contract(campaign.collateralToken) // @todo needs update when using wagmi and privy

	// More efficient to simply store the decimals in `campaigns.json` rather than doing an RPC request
	const decimals = campaign.decimals

	// Contracts
	const collateralTokenContract = {
		address: campaign.collateralToken,
		abi: ERC20ABI,
	} as const

	const divaContract = {
		address: campaign.divaContractAddress,
		abi: campaign.divaContractAddress === divaContractAddressOld && chain.id === 137
			? DivaABIold
			: DivaABI,
	} as const

	const { switchChain } = useSwitchChain()
	const debouncedAmount = useDebounce(amount, 300)

	const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })
  
	if (!ready) {
		// Do nothing while the PrivyProvider initializes with updated user state
	  return null;
	}

	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a login page
		// router.push('/login');
	}

	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a login page
		// router.push('/login');
	}

	// @todo needed in the presence of wagmi?
	// Test the wallet connect feature if wallet is not connected
	// const handleOpen = () => {
	// 	;(window as any).ethereum.request({
	// 		method: 'wallet_switchEthereumChain',
	// 		params: [{ chainId: chainConfig.chainId }],
	// 	})
	// }
	const handleOpen = () => {
		switchChain?.(chainConfig.chainId)
	}
	
	const checkAllowance = async () => {
		// Replace commas in the `amount` string with dots
		const sanitized = debouncedAmount?.replace(/,/g, '.')
		if (Number(sanitized) > 0 && collateralTokenContract != null) {
			const allowance = await readContract(wagmiConfig, {
				...collateralTokenContract,
				functionName: 'allowance',
				args: [activeAddress, campaign.divaContractAddress],
			}) as BigNumber

			if (allowance.gte(parseUnits(sanitized!.toString(), decimals))) {
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
	}
	// setExpiryTime(Number(campaign.expiryTimestamp) * 1000)

	// Check user allowance and enable/disable the Approve and Donate buttons accordingly
	// useEffect(() => {
	if (ready && chain) {
		// @todo Potential to optimize by using debounce to reduce the number of RPC calls while user is typing.
		
		if (chain.id === chainConfig.chainId && activeAddress != null) {
			checkAllowance()
		}
	// }, [
	// 	activeAddress,
	// 	amount,
	// 	chain,
	// 	collateralTokenContract,
	// 	campaign.divaContractAddress,
	// 	decimals,
	// ])

	// Update state variables for all campaigns in `campaigns.json`
	// useEffect(() => {
		if (
			isConnected &&
			chain.id === chainConfig.chainId &&
			activeAddress != null
		) {
			let sumCapacityPools: number | 'Unlimited'
			let sumToGoPools: number | 'Unlimited'
			let sumRaisedPools: number

			Promise.all(
				// @todo consider using multicall here, similar to CampaignSection
				campaign.pools.map((pool: CampaignPool) =>
					readContract(wagmiConfig, {
						...divaContract,
						functionName: 'getPoolParameters',
						args: [pool.poolId],
					}).then((res: any) => {
						return {
							poolParams: res,
							beneficiarySide: pool.beneficiarySide,
						}
					})
				)
			).then((poolData: PoolExtended[]) => {
				// Create an array to store promises for fetching beneficiary token balances
				const balancePromises = poolData.map((pool) => {
					const beneficiaryTokenContract = {
						address:
							pool.beneficiarySide === 'short'
								? pool.poolParams.shortToken
								: pool.poolParams.longToken,
						abi: ERC20ABI, // Position token is an extended version of ERC20, but using ERC20 ABI is fine here
					} as const
					return readContract(wagmiConfig, {
						...beneficiaryTokenContract,
						functionName: 'balanceOf',
						args: [campaign.donationRecipients[0].address],
					}) // @todo consider removing the array type from donationRecipients in campaigns.json and simply use an object as there shouldn't be multiple donation recipients yet
				})

				// Use Promise.all to fetch the beneficiary token balances for all pools
				return Promise.all(balancePromises).then(
					(beneficiaryTokenBalances: string[]) => {
						// Aggregate the raised amount across the pools linked to the campaign. Note that using
						// `collateralBalance` may not equal to raised amount if users choose a different recipient
						// address during add liquidity.
						sumRaisedPools = Number(
							formatUnits(
								beneficiaryTokenBalances.reduce(
									(acc, data) => acc.add(data),
									ethers.BigNumber.from(0)
								),
								decimals
							)
						)
						if (campaign.raised !== '') {
							sumRaisedPools = Number(campaign.raised)
						}
						setRaised(sumRaisedPools)

						// Aggregate the total pool capacity
						if (isUnlimited(poolData[0].poolParams.capacity)) {
							sumCapacityPools = 'Unlimited'
						} else {
							sumCapacityPools = Number(
								formatUnits(
									poolData.reduce(
										(acc, data) => acc.add(data.poolParams.capacity),
										ethers.BigNumber.from(0)
									),
									decimals
								)
							)
						}
						if (campaign.goal !== '') {
							sumCapacityPools = Number(campaign.goal)
						}
						setGoal(sumCapacityPools)

						// Derive ToGo from `sumCapacityPools` and `sumRaisedPools`
						if (sumCapacityPools === 'Unlimited') {
							sumToGoPools = 'Unlimited'
						} else {
							sumToGoPools = sumCapacityPools - sumRaisedPools
						}
						setToGo(sumToGoPools)
					}
				)
			})
		}
	// }, [chain, donateLoading, activeAddress, collateralTokenContract])

	// useEffect(() => {
		setPercentage(goal === 'Unlimited' ? 0 : (raised / goal) * 100)
	// }, [goal, raised, donateLoading])

	const handleApprove = async () => {
		setApproveLoading(true)
		writeContract(wagmiConfig, {
			...collateralTokenContract,
			functionName: 'approve',
			args: [campaign.divaContractAddress, parseUnits(amount, decimals).add(10)], // small buffer added to ensure sufficient allowance
			})
			.then((tx: any) => {
				// @todo not sure it returns a tx here and whether it has a wait() method in wagmi
				tx.wait()
					.then(() => {
						setApproveEnabled(false)
						setDonateEnabled(true)
						setApproveLoading(false)
					})
					.catch((err: any) => {
						setApproveLoading(false)
						console.log(err)
					})
			})
			.catch((err: any) => {
				setApproveLoading(false)
				console.log(err)
			})
	}
	const handleDonation = async () => {
		if (amount != null) {
			setDonateLoading(true)

			// @todo test this
			Promise.all(
				campaign.pools.map((pool) =>
					readContract(wagmiConfig, {
						...divaContract,
						functionName: 'getPoolParameters',
						args: [pool.poolId],
					}).then((res: any) => {
						return res.capacity
					})
				)
			).then((capacities) => {
				const sumCapacity = capacities.reduce(
					(acc, capacity) => acc.add(capacity),
					ethers.BigNumber.from(0)
				)

				// Prepare args for `batchAddLiquidity` smart contract call
				const batchAddLiquidityArgs = campaign.pools.map((pool, index) => {
					const collateralAmountIncr = parseUnits(amount.toString(), decimals)
						.mul(capacities[index])
						.div(sumCapacity)

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

				writeContract(wagmiConfig, {
					...divaContract,
					functionName: 'batchAddLiquidity',
					args: [batchAddLiquidityArgs],
				})
					.then((tx: any) => {
						// @todo not sure it returns a tx here and whether it has a wait() method in wagmi
						tx.wait().then(() => {
							setDonateLoading(false)
							onOpen() // Open Success Modal
						})
					})
					.catch((err: any) => {
						setDonateLoading(false)
						console.log(err)
					})
			})
		}
	}

	const handleMax = () => {
		if (balance != null) {
			setAmount(balance.toString())
		}
	}
	const handleAmountChange = (e: any) => {
		setAmount(e.target.value)
	}

	// useEffect(() => {
	const getBalance = async () => {
		if (activeAddress) {
			const result = await readContract(wagmiConfig, {
				...collateralTokenContract,
				functionName: 'balanceOf',
				args: [activeAddress],
			}) as bigint
			const tokenAmount = Number(
				formatUnits(result, decimals)
			)
			setBalance(tokenAmount)
		}
	}
	if (chain && chain.id === chainConfig.chainId && activeAddress != null) {
		getBalance()
	}
	// }, [chain, activeAddress, donateLoading, collateralTokenContract])

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
								chainId={chain.id}
								isOpen={isOpen}
								onClose={onClose}
								percentage={percentage}
								goal={goal}
								raised={raised}
								amount={amount}
								handleAmountChange={handleAmountChange}
								balance={balance}
								campaign={campaign}
								approveLoading={approveLoading}
								handleApprove={handleApprove}
								toGo={toGo}
								approveEnabled={approveEnabled}
								donateLoading={donateLoading}
								handleDonation={handleDonation}
								donateEnabled={donateEnabled}
								openConnectModal={connectWallet}
								handleOpen={handleOpen}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)}
}
