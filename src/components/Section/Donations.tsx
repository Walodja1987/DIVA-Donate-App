'use client'
import { ethers } from 'ethers'
import { DivaABI, DivaABIold, ERC20ABI } from '../../abi'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount, useSwitchNetwork, useProvider, useNetwork } from 'wagmi'
import { useERC20Contract } from '../../utils/hooks/useContract'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { getTokenBalance } from '../../utils/general'
import { Progress, ProgressLabel, Text } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import AddToMetamaskIcon from '../AddToMetamaskIcon'
import pools from '../../../config/pools.json' // @todo remove
import campaigns from '../../../config/campaigns.json'
import { divaContractAddressOld, divaContractAddress } from '../../constants'
import { formatDate, isExpired } from '../../utils/general'
import { chainConfig } from '../../constants'
import { getContract } from '@wagmi/core'
import { CampaignPool, Campaign } from '../../types/campaignTypes'
import { Pool, Status } from '../../types/poolTypes'
import {
	Multicall,
	ContractCallResults,
	ContractCallContext,
} from 'ethereum-multicall'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
} from '@chakra-ui/react'

export default function Donations() {
	const [redeemLoading, setRedeemLoading] = useState<{
		[campaignId: string]: boolean
	}>({})
	const [donated, setDonated] = useState<{ [campaignId: string]: number }>({})
	const [campaignBalance, setCampaignBalance] = useState<{
		[campaignId: string]: number
	}>({})
	const [percentageDonated, setPercentageDonated] = useState<{
		[campaignId: string]: number
	}>({})
	const [expiryTime, setExpiryTime] = useState<{
		[campaignId: string]: number
	}>({})
	const [claimEnabled, setClaimEnabled] = useState<{
		[campaignId: string]: boolean
	}>({})
	const [campaignsParticipated, setCampaignsParticipated] = useState(0)
	const [statusFinalReferenceValue, setStatusFinalReferenceValue] = useState<{
		[campaignId: string]: Status
	}>({})
	const { address: activeAddress, isConnected } = useAccount()
	const { chain } = useNetwork()
	const wagmiProvider = useProvider()
	const { openConnectModal } = useConnectModal()
	const { switchNetwork } = useSwitchNetwork()

	const [chainId, setChainId] = React.useState<number>(0) // @todo Question: Needed if wagmi's useNetwork() hook is used?

	const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })

	// ----------------------------
	// Event handlers
	// ----------------------------
	// const handleOpen = () => {
	// 	;(window as any as any).ethereum.request({
	// 		method: 'wallet_switchEthereumChain',
	// 		params: [{ chainId: chainConfig.chainId }],
	// 	})
	// }

	const handleOpen = () => {
		switchNetwork?.(chainConfig.chainId)
	}

	// @todo Function kept to replace Promise.all blocks with multicall at a later stage
	/**
	 * @notice Function to fetch the pool parameters from the pools linked to the given array of campaigns
	 * using ethereum-multicall lib.
	 * @dev Accounts for the first pilot campaign `pastoralists_1` which was executed on Polygon using
	 * a pre-audited version of DIVA Protocol.
	 * @param chainId Chain id. Only used to identify the `pastoralists_1` campaign on Polygon.
	 * @param provider Web3 provider.
	 * @param campaigns Array of campaign objects (including `pools` field).
	 * @return Multicall results object.
	 */
	const fetchPoolParams = async (
		chainId: number,
		provider: any,
		campaigns: Campaign[]
	) => {
		const multicall = new Multicall({
			ethersProvider: provider,
			tryAggregate: true,
		})

		let multicallArgs: any[] = []
		campaigns.forEach((campaign, indexCampaign) => {
			campaign.pools.forEach((pool, indexPool) => {
				multicallArgs.push({
					reference: 'pool-' + indexCampaign + '-' + indexPool,
					contractAddress: campaign.divaContractAddress,
					abi:
						campaign.divaContractAddress === divaContractAddressOld &&
						chainId === 137
							? DivaABIold
							: DivaABI, // only campaignId = "pastoralists_1" on Polygon has the old DIVA Protocol address linked to it
					calls: [
						{
							reference:
								'getPoolParametersPool-' + indexCampaign + '-' + indexPool,
							methodName: 'getPoolParameters',
							methodParameters: [pool.poolId],
						},
					],
				})
			})
		})

		const contractCallContext: ContractCallContext[] = multicallArgs

		const results: ContractCallResults = await multicall.call(
			contractCallContext
		)
		console.log('results poolParams', results)
		return results
	}

	// @todo Function kept to replace Promise.all blocks with multicall at a later stage
	/**
	 * @notice Function to fetch the balances of the provided tokens for the provided users
	 * @param provider Web3 provider.
	 * @param tokens Array of token addresses.
	 * @param users Array of user addresses.
	 * @returns Multicall results object.
	 */
	const fetchPositionTokenBalances = async (
		provider: any,
		tokens: string[],
		users: string[]
	) => {
		const multicall = new Multicall({
			ethersProvider: provider,
			tryAggregate: true,
		})

		let multicallArgs: any[] = []
		tokens.forEach((token, indexToken) => {
			multicallArgs.push({
				reference: 'token-' + indexToken,
				contractAddress: token,
				abi: ERC20ABI,
				calls: [
					{
						reference: 'balanceToken-' + indexToken,
						methodName: 'balanceOf',
						methodParameters: [users[indexToken]],
					},
				],
			})
		})

		const contractCallContext: ContractCallContext[] = multicallArgs

		const results: ContractCallResults = await multicall.call(
			contractCallContext
		)
		console.log('results token balances', results)
		return results
	}

	// @todo Function kept to replace Promise.all blocks with multicall at a later stage
	const processMulticallResult = (data: ContractCallResults): any[] => {
		const res = []

		for (const item in data.results) {
			const itemData = data.results[item]

			const returnValues = itemData.callsReturnContext[0].returnValues

			// Convert the array of values into an array of objects
			const valueObjects = returnValues.map((value) => ({ value }))

			res.push(valueObjects)
		}
		// console.log('data', data)
		// console.log('res', res)
		return res
	}

	useEffect(() => {
		if (chain) {
			setChainId(chain.id)
		}

		// Keep for later to better understanding the output of multicall
		// const test = async () => {
		// 	// Some multicall testing
		// 	const provider = new ethers.providers.Web3Provider(
		// 		(window as any).ethereum
		// 	)

		// 	const res = await fetchPoolParams(chainId, provider, [campaigns[1]])
		// 	const poolParams = processMulticallResult(res)
		// 	console.log('poolParams', poolParams)

		// }

		// test()
	}, [chain])

	const updateCampaignBalance = (campaignId: string, tokenAmount: number) => {
		setCampaignBalance((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}

	const updateClaimEnabled = (campaignId: string, enabled: boolean) => {
		setClaimEnabled((prev) => ({
			...prev,
			[campaignId]: enabled,
		}))
	}

	const updateStatusFinalReferenceValue = (
		campaignId: string,
		status: Status
	) => {
		setStatusFinalReferenceValue((prev) => ({
			...prev,
			[campaignId]: status,
		}))
	}

	const updateRedeemLoading = (campaignId: string, loading: boolean) => {
		setRedeemLoading((prev) => ({
			...prev,
			[campaignId]: loading,
		}))
	}

	const updateDonated = (campaignId: string, value: number) => {
		setDonated((prev) => ({
			...prev,
			[campaignId]: value,
		}))
	}

	const updateExpiryTime = (
		campaignId: string,
		expiryTimeInMilliseconds: number
	) => {
		setExpiryTime((prev) => ({
			...prev,
			[campaignId]: expiryTimeInMilliseconds,
		}))
	}

	const updatePercentageDonated = (campaignId: string, percentage: number) => {
		setPercentageDonated((prev) => ({
			...prev,
			[campaignId]: percentage,
		}))
	}

	const handleRedeemPositionToken = async (campaign: Campaign) => {
		const provider = new ethers.providers.Web3Provider((window as any).ethereum)

		const divaContract = new ethers.Contract(
			campaign.divaContractAddress,
			campaign.divaContractAddress === divaContractAddressOld
				? DivaABIold
				: DivaABI,
			provider.getSigner() // @todo Why not wagmiProvider like in CampaignSection?
		)

		updateRedeemLoading(campaign.campaignId, true)

		// @todo Potentially easier to hard-code the donor position tokens in campaign.json as well rather
		// than querying them
		Promise.all(
			campaign.pools.map((pool) => {
				// @todo Replace with multicall at a later stage
				return divaContract.getPoolParameters(pool.poolId).then((res: Pool) => {
					return res
				})
			})
		).then((poolData: Pool[]) => {
			Promise.all(
				poolData.map((pool: Pool) => {
					// Assumes that beneficiarySide is the same for all pools linked to a campaign
					const donorPositionToken =
						campaign.pools[0].beneficiarySide === 'short'
							? pool.longToken
							: pool.shortToken

					const positionTokenContract = getContract({
						address: donorPositionToken,
						abi: ERC20ABI,
						signerOrProvider: wagmiProvider,
					})

					return getTokenBalance(
						positionTokenContract,
						activeAddress as `0x${string}`
					).then((res) => {
						return {
							poolData: pool,
							donorPositionToken: donorPositionToken,
							balance: res?.balance, // User's position token balance in the pool. Unformatted balance for easier handling when multiplying with payout amount
						}
					})
				})
			).then((data) => {
				// Prepare args for `batchRedeemPositionToken` smart contract call
				const batchRedeemPositionTokenArgs = data.map((pool) => {
					return {
						positionToken: pool.donorPositionToken,
						amount: pool.balance,
					}
				})

				divaContract
					.batchRedeemPositionToken(batchRedeemPositionTokenArgs)
					.then((tx: any) => {
						tx.wait()
							.then(() => {
								updateRedeemLoading(campaign.campaignId, false)
								onOpen() // Open Success Modal
							})
							.catch((err: any) => {
								updateRedeemLoading(campaign.campaignId, false)
								console.log(err)
							})
					})
					.catch((err: any) => {
						updateRedeemLoading(campaign.campaignId, false)
						console.log(err)
					})
			})
		})
	}

	// @todo Duplicated in CampaignSection component. Move into general.tsx
	const handleAddToMetamask = async (campaign: any) => {
		for (const pool of campaign.pools) {
			const divaContract = getContract({
				address: campaign.divaContractAddress,
				abi:
					campaign.divaContractAddress === divaContractAddressOld
						? DivaABIold
						: DivaABI,
				signerOrProvider: wagmiProvider,
			})

			const poolParams = await divaContract.getPoolParameters(pool.poolId)
			const donorPositionToken =
				pool.beneficiarySide === 'short'
					? poolParams.longToken
					: poolParams.shortToken

			const token = getContract({
				address: donorPositionToken,
				abi: ERC20ABI,
				signerOrProvider: wagmiProvider,
			})
			const decimals = await token.decimals()
			const symbol = await token.symbol()

			try {
				await (window as any).ethereum.request({
					method: 'wallet_watchAsset',
					params: {
						type: 'ERC20',
						options: {
							address: donorPositionToken,
							symbol: symbol,
							decimals: decimals,
							image:
								'https://res.cloudinary.com/dphrdrgmd/image/upload/v1641730802/image_vanmig.png',
						},
					} as any,
				})
			} catch (error) {
				console.error('Error in HandleAddMetaMask', error)
			}
		}
	}

	// Update state variables for all campaigns in `campaigns.json`
	useEffect(() => {
		if (
			chainId === chainConfig.chainId &&
			activeAddress != null &&
			typeof window !== 'undefined' &&
			typeof window.ethereum !== 'undefined'
		) {
			// Variable used as a flag to display "Explore campaigns" message if user didn't make any donations
			// yet or has already re-claimed the funds from previous campaigns.
			let countCampaignsParticipated = 0

			// Loop through each campaign in `campaign.json` and update the state variables
			campaigns.forEach((campaign) => {
				// More efficient to simply store the decimals in `campaigns.json` rather than doing an RPC request
				const decimals = campaign.decimals

				// Connect to corresponding contract. Note that the first campaign was using a pre-audited
				// version of the DIVA Protocol contract. All subsequent campaigns are using the audited final version.
				const divaContract = getContract({
					address: campaign.divaContractAddress,
					abi:
						campaign.divaContractAddress === divaContractAddressOld
							? DivaABIold
							: DivaABI,
					signerOrProvider: wagmiProvider,
				})

				// Get pool parameters for the underlying campaign, check user's position token balance and
				// calculate donated amount.
				// @todo Replace with multicall at a later stage
				Promise.all(
					campaign.pools.map((pool) => {
						return divaContract
							.getPoolParameters(pool.poolId)
							.then((res: any) => {
								return res
							})
					})
				).then((poolData) => {
					// Get user's position token balance
					Promise.all(
						poolData.map((pool) => {
							// Assumes that beneficiarySide is the same for all pools linked to a campaign
							const donorPositionToken =
								campaign.pools[0].beneficiarySide === 'short'
									? pool.longToken
									: pool.shortToken

							const positionTokenContract = getContract({
								address: donorPositionToken,
								abi: ERC20ABI,
								signerOrProvider: wagmiProvider,
							})

							return getTokenBalance(positionTokenContract, activeAddress).then(
								(res) => {
									return {
										poolParams: pool,
										balance: res?.balance, // User's position token balance in the pool. Unformatted balance for easier handling when multiplying with payout amount
									}
								}
							)
						})
					)
						.then((poolResults) => {
							const sumTokenBalanceFormatted = Number(
								formatUnits(
									poolResults.reduce(
										(acc, data) => acc.add(data.balance),
										ethers.BigNumber.from(0)
									),
									decimals
								)
							)
							updateCampaignBalance(
								campaign.campaignId,
								sumTokenBalanceFormatted
							)

							if (sumTokenBalanceFormatted > 0) {
								countCampaignsParticipated += 1
							}

							// @todo Assumes that the beneficiary side for all the pools linked to a campaign are the same
							let sumDonated
							if (campaign.pools[0].beneficiarySide === 'short') {
								sumDonated = poolResults.reduce(
									(acc, data) =>
										acc.add(data.poolParams.payoutShort.mul(data.balance)),
									ethers.BigNumber.from(0)
								)
							} else {
								sumDonated = poolResults.reduce(
									(acc, data) =>
										acc.add(data.poolParams.payoutLong.mul(data.balance)),
									ethers.BigNumber.from(0)
								)
							}

							const sumDonatedFormatted = Number(
								formatUnits(sumDonated.div(parseUnits('1', decimals)), decimals)
							)
							updateDonated(campaign.campaignId, sumDonatedFormatted)

							updatePercentageDonated(
								campaign.campaignId,
								(sumDonatedFormatted / sumTokenBalanceFormatted) * 100
							) // @todo Update with actual value

							// Assumes that `expiryTime` for all linked pools is the same.
							// `campaignId` is the same for all items in the `data` array, hence it's
							// ok to use the `campaignId` of the first item (`data[0]`)
							updateExpiryTime(
								campaign.campaignId,
								Number(poolResults[0].poolParams.expiryTime) * 1000
							)

							// Enable claim button only if the final value has been confirmed and there is something to claim.
							// Accounts for 0.3% fee that is withheld by DIVA Protocol at claim time.
							const currentStatusFinalReferenceValue =
								poolResults[0].poolParams.statusFinalReferenceValue
							currentStatusFinalReferenceValue === 3 &&
							Math.floor(
								sumTokenBalanceFormatted * 0.997 - sumDonatedFormatted
							) > 0
								? updateClaimEnabled(campaign.campaignId, true)
								: updateClaimEnabled(campaign.campaignId, false)
							updateStatusFinalReferenceValue(
								campaign.campaignId,
								currentStatusFinalReferenceValue
							)
						})
						.then(() => {
							setCampaignsParticipated(countCampaignsParticipated)
						})
				})
			})
		}
	}, [
		chainId,
		activeAddress,
		pools,
		!campaignBalance,
		claimEnabled == null,
		isOpen === false,
	])

	// @todo Navigating from Donations to Home breaks the app
	return (
		<div className="pt-[5rem] lg:pb-[200px] sm:pt-[8rem] md:pt-[8rem] my-auto mx-auto px-4">
			<div className="pb-10 flex flex-col items-center justify-center">
				<h1 className="font-lora text-4xl md:text-[60px] text-center lg:text-left">
					My Donations
				</h1>
				<hr className="w-48 h-[8px] mx-auto bg-[#9FC131] border-0 rounded-[20px] mt-5" />
			</div>
			{/* @todo improve that part as it will show this message even when wallet is disconnected */}
			{campaignsParticipated === 0 && (
				<div className="pb-[23rem] flex flex-col items-center justify-center">
					<p className="mt-[60px]">{`You have already claimed your donations or you haven't made any donations yet`}</p>
					<Link href="/">
						<button
							type="button"
							className="mt-10 text-white bg-[#042940] hover:bg-blue-700 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
							Explore Campaigns
						</button>
					</Link>
				</div>
			)}
			<div className="flex flex-row flex-wrap gap-10 justify-center">
				{campaigns.map((campaign) => {
					if (campaignBalance[campaign.campaignId] > 0) {
						return (
							// eslint-disable-next-line react/jsx-key
							<div
								key={campaign.campaignId}
								className="max-w-sm mb-10 bg-[#DEEFE7] border border-gray-200 rounded-[16px] shadow-md ">
								<Link href={campaign.path}>
									<Image
										className="h-[300px] rounded-t-[16px] object-cover"
										width="800"
										height="800"
										src={campaign.img}
										alt="Modern building architecture"
									/>
									<div className="relative -mt-10">
										<div
											className={`
										${
											expiryTime[campaign.campaignId] && isConnected
												? ''
												: 'invisible'
										} // Add 'invisible' class conditionally
										${
											isExpired(expiryTime[campaign.campaignId])
												? 'bg-[#005C53] text-white'
												: 'bg-[#DBF227] text-green-[#042940]'
										}
										text-2xs pt-1 pl-2 w-[320px] h-[40px] rounded-tr-[3.75rem] text-left
									`}>
											{expiryTime[campaign.campaignId] && (
												<span className="mt-1 inline-block align-middle">
													<b>
														{isExpired(expiryTime[campaign.campaignId])
															? 'Completed'
															: 'Expiry:'}
													</b>
													{isExpired(expiryTime[campaign.campaignId])
														? null
														: ` ${formatDate(expiryTime[campaign.campaignId])}`}
												</span>
											)}
										</div>
									</div>
								</Link>
								<div className="p-5">
									<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-[#042940]">
										{campaign.title}
										<button onClick={() => handleAddToMetamask(campaign)}>
											<AddToMetamaskIcon />
										</button>
									</h5>
									<div className=" h-[100px] mb-5 border-b-2 border-[#9FC131]">
										<p className="mb-3 font-normal text-[#000000]">
											{campaign.desc}
										</p>
									</div>

									{/* If you receive the error "TypeScript: Expression produces a union type that is too complex to represent.", then follow this advice: https://stackoverflow.com/questions/74847053/how-to-fix-expression-produces-a-union-type-that-is-too-complex-to-represent-t */}
									{chainId === chainConfig.chainId ? (
										<>
											<Modal isCentered isOpen={isOpen} onClose={onClose}>
												<ModalOverlay
													bg="blackAlpha.300"
													backdropFilter="blur(5px)"
												/>
												<ModalContent>
													<ModalHeader>
														🍀 You have successfully claimed the unfunded!{' '}
													</ModalHeader>
													<ModalCloseButton />
													<ModalBody>
														Help us improve our product by participating in our{' '}
														<span className="font-semibold">survey</span>
													</ModalBody>

													<ModalFooter>
														<Button variant="ghost" mr={3} onClick={onClose}>
															No Thanks
														</Button>
														<Button 
															className="text-white"
															sx={{
																backgroundColor: '#005C53',
																_hover: {
																	backgroundColor: '#005C53',
																},
															}}>
															<Link
																href="https://o26wxmqxfy2.typeform.com/to/FwmhnSq7"
																target="_blank"
																rel="noopener noreferrer">
																Take Survey
															</Link>
														</Button>
													</ModalFooter>
												</ModalContent>
											</Modal>
											<Progress
												className=" mb-3 rounded-[15px]"
												style={{ background: '#D6D58E' }}
												colorScheme="green"
												height="22px"
												value={percentageDonated[campaign.campaignId]}>
												<ProgressLabel className="text-2xl flex flex-start">
													<Text fontSize="xs" marginLeft="0.5rem">
														{percentageDonated[campaign.campaignId]?.toFixed(1)}
														%
													</Text>
												</ProgressLabel>
											</Progress>
										</>
									) : (
										<div className="h-[30px]"></div>
									)}

									{isConnected ? (
										<>
											{chainId === chainConfig.chainId ? (
												<div className="grid grid-cols-2 text-center divide-x-[1px] divide-[#005C53] mb-3">
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Committed
														</dt>
														<dd className="font-normal text-base text-[#042940] ">
															$
															{campaignBalance &&
															!isNaN(campaignBalance[campaign.campaignId])
																? Number(
																		campaignBalance[campaign.campaignId]
																  ).toFixed(1)
																: 0.0}
														</dd>
													</div>
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Donated
														</dt>
														<dd className="font-normal text-base text-[#042940] ">
															$
															{donated && !isNaN(donated[campaign.campaignId])
																? Number(donated[campaign.campaignId]).toFixed(
																		1
																  )
																: 0.0}
														</dd>
													</div>
												</div>
											) : (
												<div className="mb-10 flex flex-col items-center justify-center ">
													<div className=" flex items-center justify-center">
														Please
														<span>
															<button
																className="p-2 text-blue-600"
																onClick={handleOpen}>
																connect
															</button>
														</span>
														{` to the ${chainConfig.name} network.`}
													</div>
												</div>
											)}
										</>
									) : (
										<div className="mb-10 flex flex-col items-center justify-center ">
											<div className=" flex items-center justify-center">
												Please
												<span>
													<button
														className="p-2 text-blue-600"
														onClick={openConnectModal}>
														connect
													</button>
												</span>
												{` to the ${chainConfig.name} network.`}
											</div>
										</div>
									)}
									{redeemLoading[campaign.campaignId] ? (
										<div role="status" className="flex justify-center mt-4">
											<svg
												aria-hidden="true"
												className="w-9 h-9 text-gray-200 animate-spin dark:text-gray-600 fill-green-700"
												viewBox="0 0 100 101"
												fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path
													d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
													fill="currentColor"
												/>
												<path
													d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
													fill="currentFill"
												/>
											</svg>
										</div>
									) : (
										<button
											disabled={!claimEnabled[campaign.campaignId]}
											onClick={() => handleRedeemPositionToken(campaign)}
											type="button"
											className="disabled:hover:bg-[#042940] disabled:opacity-25 text-white bg-[#042940] hover:bg-blue-700 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
											{isExpired(expiryTime[campaign.campaignId]) &&
											statusFinalReferenceValue[campaign.campaignId] !== 3
												? 'In Settlement'
												: 'Claim Unfunded Amount'}
										</button>
									)}
								</div>
							</div>
						)
					}
				})}
			</div>
		</div>
	)
}
