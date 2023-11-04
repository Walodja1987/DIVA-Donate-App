import React, { useEffect, useState } from 'react'
import { useERC20Contract } from '../../utils/hooks/useContract'
import { getTokenBalance } from '../../utils/general'
import { ethers } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import {
	useAccount,
	useSwitchNetwork,
	useFeeData,
	useProvider,
	useNetwork,
} from 'wagmi'
import { DivaABI, DivaABIold, ERC20ABI } from '../../abi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Campaign, CampaignPool } from '../../types/campaignTypes'
import { formatDate, isExpired, isUnlimited } from '../../utils/general'
import { chainConfig } from '../../constants'
import { divaContractAddressOld } from '../../constants'
import { getContract } from '@wagmi/core'
import { useDisclosure } from '@chakra-ui/react'
import { DonationCard } from './DonationCard'
import { useDebounce } from '../../utils/hooks/useDebounce'
import { PoolExtended } from '../../types/poolTypes'

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
	const { data } = useFeeData({ chainId: chainConfig.chainId })
	const [amount, setAmount] = useState<string>('')
	const [goal, setGoal] = useState<number | 'Unlimited'>(0)
	const [raised, setRaised] = useState<number>(0)
	const [toGo, setToGo] = useState<number | 'Unlimited'>(0)
	const [percentage, setPercentage] = useState<number>(0)
	const [approveEnabled, setApproveEnabled] = useState<boolean>(false)
	const [approveLoading, setApproveLoading] = useState<boolean>(false)
	const [donateEnabled, setDonateEnabled] = useState<boolean>(false)
	const [donateLoading, setDonateLoading] = useState<boolean>(false)
	const [expiryTime, setExpiryTime] = useState<number>(0)

	const { address: activeAddress, isConnected } = useAccount()
	const collateralTokenContract = useERC20Contract(campaign.collateralToken)

	// More efficient to simply store the decimals in `campaigns.json` rather than doing an RPC request
	const decimals = campaign.decimals

	const [chainId, setChainId] = React.useState<number>(0)
	const { chain } = useNetwork()
	const wagmiProvider = useProvider()
	const { openConnectModal } = useConnectModal()
	const { switchNetwork } = useSwitchNetwork()
	const debouncedAmount = useDebounce(amount, 300)

	const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })

	// @todo needed in the presence of wagmi?
	// Test the wallet connect feature if wallet is not connected
	// const handleOpen = () => {
	// 	;(window as any).ethereum.request({
	// 		method: 'wallet_switchEthereumChain',
	// 		params: [{ chainId: chainConfig.chainId }],
	// 	})
	// }
	const handleOpen = () => {
		switchNetwork?.(chainConfig.chainId)
	}

	useEffect(() => {
		if (chain) {
			setChainId(chain.id)
		}
	}, [chain])

	// Check user allowance and enable/disable the Approve and Donate buttons accordingly
	useEffect(() => {
		// @todo Potential to optimize by using debounce to reduce the number of RPC calls while user is typing.
		const checkAllowance = async () => {
			// Replace commas in the `amount` string with dots
			const sanitized = debouncedAmount?.replace(/,/g, '.')
			if (Number(sanitized) > 0 && collateralTokenContract != null) {
				const allowance = await collateralTokenContract.allowance(
					activeAddress,
					campaign.divaContractAddress
				)

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
		if (chainId === chainConfig.chainId && activeAddress != null) {
			checkAllowance()
		}
	}, [
		activeAddress,
		amount,
		chainId,
		collateralTokenContract,
		campaign.divaContractAddress,
		decimals,
	])

	// Update state variables for all campaigns in `campaigns.json`
	useEffect(() => {
		if (
			chainId === chainConfig.chainId &&
			activeAddress != null &&
			typeof window != 'undefined' &&
			typeof window?.ethereum != 'undefined'
		) {
			let sumCapacityPools: number | 'Unlimited'
			let sumToGoPools: number | 'Unlimited'
			let sumRaisedPools: number
			const divaContract = getContract({
				address: campaign.divaContractAddress,
				abi:
					campaign.divaContractAddress === divaContractAddressOld &&
					chainId === 137
						? DivaABIold
						: DivaABI,
				signerOrProvider: wagmiProvider,
			})

			Promise.all(
				campaign.pools.map((pool: CampaignPool) =>
					divaContract.getPoolParameters(pool.poolId).then((res: any) => {
						return {
							poolParams: res,
							beneficiarySide: pool.beneficiarySide,
						}
					})
				)
			).then((poolData: PoolExtended[]) => {
				// Assumes that `expiryTime` for all linked pools is the same.
				setExpiryTime(Number(poolData[0].poolParams.expiryTime) * 1000)

				// Create an array to store promises for fetching beneficiary token balances
				const balancePromises = poolData.map((pool) => {
					const beneficiaryTokenContract = getContract({
						address:
							pool.beneficiarySide === 'short'
								? pool.poolParams.shortToken
								: pool.poolParams.longToken,
						abi: ERC20ABI, // Position token is an extended version of ERC20, but using ERC20 ABI is fine here
						signerOrProvider: wagmiProvider,
					})
					return beneficiaryTokenContract.balanceOf(
						campaign.donationRecipients[0].address
					) // @todo consider removing the array type from donationRecipients in campaigns.json and simply use an object as there shouldn't be multiple donation recipients yet
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
	}, [chainId, donateLoading, activeAddress, collateralTokenContract])

	useEffect(() => {
		setPercentage(goal === 'Unlimited' ? 0 : (raised / goal) * 100)
	}, [goal, raised, donateLoading])

	const handleApprove = async () => {
		setApproveLoading(true)
		collateralTokenContract
			.approve(
				campaign.divaContractAddress,
				parseUnits(amount, decimals).add(10),
				{
					// small buffer added to ensure sufficient allowance
					gasPrice: data?.gasPrice,
				}
			)
			.then((tx: any) => {
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
			// const divaContract = getContract({
			// 	address: campaign.divaContractAddress,
			// 	abi: campaign.divaContractAddress === divaContractAddressOld ? DivaABIold : DivaABI,
			// 	signerOrProvider: wagmiProvider,
			// })

			// @todo somehow the above doesn't work... Check why that's the case
			const provider = new ethers.providers.Web3Provider(
				(window as any).ethereum
			)
			const divaContract = new ethers.Contract(
				campaign.divaContractAddress,
				campaign.divaContractAddress === divaContractAddressOld
					? DivaABIold
					: DivaABI,
				provider.getSigner() // @todo Why not wagmiProvider like in CampaignSection?
			)

			setDonateLoading(true)

			// @todo test this
			Promise.all(
				campaign.pools.map((pool) =>
					divaContract.getPoolParameters(pool.poolId).then((res: any) => {
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

				divaContract
					.batchAddLiquidity(batchAddLiquidityArgs, {
						gasPrice: data?.maxFeePerGas,
					})
					.then((tx: any) => {
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

	useEffect(() => {
		const getBalance = async () => {
			if (activeAddress) {
				const result = await getTokenBalance(
					collateralTokenContract,
					activeAddress
				)
				const tokenAmount = Number(
					formatUnits(result?.balance, result?.decimals)
				)
				setBalance(tokenAmount)
			}
		}
		if (chainId === chainConfig.chainId && activeAddress != null) {
			getBalance()
		}
	}, [chainId, activeAddress, donateLoading, collateralTokenContract])

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
								chainId={chainId}
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
								openConnectModal={openConnectModal}
								handleOpen={handleOpen}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
