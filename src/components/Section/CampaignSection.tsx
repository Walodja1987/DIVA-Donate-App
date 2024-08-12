'use client';

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { DivaABI, DivaABIold, ERC20ABI } from '../../abi'
import { formatUnits } from 'ethers/lib/utils'
import { useAccount, useSwitchChain, useClient } from 'wagmi'
import { useERC20Contract } from '../../utils/hooks/useContract'
import { Text, Progress, ProgressLabel } from '@chakra-ui/react'
import { usePrivy, useWallets } from '@privy-io/react-auth';
import AddToMetamaskIcon from '../AddToMetamaskIcon'
import campaigns from '../../../config/campaigns.json'
import { divaContractAddressOld } from '../../constants'
import { chainConfig } from '../../constants'
import { formatDate, isExpired, isUnlimited } from '../../utils/general'
import { Pool, PoolExtended } from '../../types/poolTypes'
import { Campaign, CampaignPool } from '../../types/campaignTypes'
import { createPublicClient, createWalletClient, custom, http, getContract } from 'viem'
import { getClient, readContract } from '@wagmi/core'
import { wagmiConfig } from '@/wagmiConfig'



// @todo I think it would be better to use toFixed inside jsx only and not store the values
// in that format. It's less of a problem if the values are not used for calculations, but if they are
// used, then it's problematic. Consider adjusting.

// @todo Fix "Donated" in CampaignSection on Home page

/**
 * @notice Campaign section on the Home page
 */
export const CampaignSection = () => {
	// React hooks
	const [goal, setGoal] = useState<{
		[campaignId: string]: number | 'Unlimited'
	}>({})
	const [raised, setRaised] = useState<{ [campaignId: string]: number }>({})
	const [toGo, setToGo] = useState<{
		[campaignId: string]: number | 'Unlimited'
	}>({})
	const [donated, setDonated] = useState<{ [campaignId: string]: number }>({})
	const [percentage, setPercentage] = useState<{
		[campaignId: string]: number
	}>({})

	// Privy hooks
	const { ready, user, authenticated, login, connectWallet, logout, linkWallet } = usePrivy();
	const { wallets, ready: walletsReady } = useWallets();

	// wagmi hooks
	const { address: activeAddress, isConnected, chain } = useAccount() // @todo consider using chainId directly instead of loading full chain object including chain.id if only id is used
	const { switchChain } = useSwitchChain()
	const client = useClient()

	// if (!ready) {
	// 	return null;
	// }

	// ----------------------------
	// Event handlers
	// ----------------------------
	const handleOpen = () => {
		switchChain?.(chainConfig.chainId)
	}

	const updateRaised = (campaignId: string, tokenAmount: number) => {
		setRaised((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}

	const updateToGo = (
		campaignId: string,
		tokenAmount: number | 'Unlimited'
	) => {
		setToGo((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}
	const updateGoal = (
		campaignId: string,
		tokenAmount: number | 'Unlimited'
	) => {
		setGoal((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}

	const updateDonated = (campaignId: string, tokenAmount: number) => {
		setDonated((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}

	const updatePercentage = (campaignId: string, percentage: number) => {
		setPercentage((prev) => ({
			...prev,
			[campaignId]: percentage,
		}))
	}

	// @todo Duplicated in Donations component. Move into general.tsx
	const handleAddToMetamask = async (campaign: any) => {
		for (const pool of campaign.pools) {
			// const divaContract = getContract({
			// 	address: campaign.divaContractAddress,
			// 	abi:
			// 		campaign.divaContractAddress === divaContractAddressOld
			// 			? DivaABIold
			// 			: DivaABI,
			// 	client: client,
			// })

			const divaContract = {
				address: campaign.divaContractAddress,
				abi: campaign.divaContractAddress === divaContractAddressOld
					? DivaABIold
					: DivaABI
			} as const

			const poolParams = await readContract(wagmiConfig, {
				...divaContract,
				functionName: 'getPoolParameters',
				args: [pool.poolId]
			})

			const donorPositionToken =
				pool.beneficiarySide === 'short'
					? poolParams.longToken
					: poolParams.shortToken

			const tokenContract = {
				address: donorPositionToken,
				abi: ERC20ABI,
			} as const

			const decimals = await readContract(wagmiConfig, {
				...tokenContract,
				functionName: 'decimals',
			})
			const symbol = await readContract(wagmiConfig, {
				...tokenContract,
				functionName: 'symbol',
			})

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

	// useEffect(() => {
	// 	if (chain) {
	// 		setChainId(chain.id)
	// 	}
	// }, [chain])

	// const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_URL;

	// Update state variables for all campaigns in `campaigns.json`
	useEffect(() => {
		// if (typeof window === 'undefined') return;

		// if (!client) return;
		console.log("HELLOE")
		console.log("isConnected", isConnected)
		console.log("chain", chain)
		console.log("chainConfig.chainId", chainConfig.chainId)
		console.log("activeAddress", activeAddress) 
		console.log("typeof window", typeof window) 
		console.log("client", client)
		if (
			isConnected &&
			chain.id === chainConfig.chainId &&
			activeAddress != null &&
			typeof window === 'undefined' && 
			typeof client != 'undefined'
		) {
			console.log("I AM HERE")
			// Loop through each campaign in `campaign.json` and update the state variables
			campaigns.forEach((campaign: Campaign) => {
				let totalGoal: number | 'Unlimited'
				let totalToGo: number | 'Unlimited'
				let totalRaised: number
				let totalDonated: number
				let percentageProgress: number

				// More efficient to simply store the decimals in `campaigns.json` rather than doing an RPC request
				const decimals = campaign.decimals

				// Note that the first campaign was using a pre-audited version of the DIVA Protocol contract.
				// To display the first campaign, it requires using the old ABI.

				const divaContract = {
					address: campaign.divaContractAddress,
					abi: campaign.divaContractAddress === divaContractAddressOld && chain.id === 137
						? DivaABIold
						: DivaABI,
				} as const

				// Create an array to store promises for each `getPoolParameters` call. Promises will be resolved
				// in the following `Promise.all` block
				Promise.all(
					campaign.pools.map((pool: CampaignPool) => {
						return readContract(wagmiConfig, {
							...divaContract,
							functionName: 'getPoolParameters',
							args: [pool.poolId]
						}).then((res: Pool) => {
								return {
									poolParams: res,
									beneficiarySide: pool.beneficiarySide,
								}
							})
					})
				).then((poolResults: PoolExtended[]) => {
					totalRaised = 0
					totalDonated = 0
					totalGoal = 0
					totalToGo = 0
					percentageProgress = 0

					// Create an array to store promises for fetching beneficiary token balances
					const balancePromises = poolResults.map((pool) => {
						const beneficiaryTokenContract = getContract({
							address: pool.beneficiarySide === 'short' ? pool.poolParams.shortToken : pool.poolParams.longToken,
							abi: ERC20ABI, // Position token is an extended version of ERC20, but using ERC20 ABI is fine here
							client: client,
						})
						return beneficiaryTokenContract.balanceOf(campaign.donationRecipients[0].address) // @todo consider removing the array type from donationRecipients in campaigns.json and simply use an object as there shouldn't be multiple donation recipients yet
					})
		
					// Use Promise.all to fetch the beneficiary token balances for all pools
					return Promise.all(balancePromises)
						.then((beneficiaryTokenBalances: string[]) => {
							// Iterate through each pool linked to the campaign, aggregate the statistics and update the
							// corresponding state variables. As we are using the values for display only, it's fine to convert them
							// into number format during calculations
							poolResults.forEach((pool, index) => {
								// Using the position token balance of the beneficiary instead of the
								// pool.collateralBalance for raised amount calculation to avoid biases
								// from non-donating addition of liquidity
								totalRaised +=
									Number(formatUnits(beneficiaryTokenBalances[index], decimals))
								totalDonated +=
									Number(formatUnits(beneficiaryTokenBalances[index], decimals)) *
										(pool.beneficiarySide === 'short'
											? Number(formatUnits(pool.poolParams.payoutShort, decimals))
											: Number(formatUnits(pool.poolParams.payoutLong, decimals)))

								// Set totalGoal to 'Unlimited' if one of the pools has 'Unlimited capacity'
								// Pools linked to a campaign should either be unlimited or limited in capacity, but not mixed
								if (
									isUnlimited(pool.poolParams.capacity) ||
									totalGoal === 'Unlimited'
								) {
									totalGoal = 'Unlimited'
									totalToGo = 'Unlimited'
								} else {
									totalGoal +=
										Number(formatUnits(pool.poolParams.capacity, decimals))
									totalToGo = totalGoal - totalRaised
								}
							})

							// Check for overwrites in `campaign.json` and use them if they exist
							if (campaign.raised !== '') {
								totalRaised = Number(campaign.raised)
							}
							if (campaign.goal !== '') {
								totalGoal = Number(campaign.goal)
								totalToGo = totalGoal - totalRaised
							}							
							if (campaign.donated !== '') {
								totalDonated = Number(campaign.donated)
							}

							// Show progress % depending on whether the final value has been already confirmed or not								
							if (Number(poolResults[0].poolParams.statusFinalReferenceValue) === 3) {
								// Scenario: Final value already confirmed
								percentageProgress = (totalDonated / totalRaised) * 100
							} else {
								// Scenario: Final value not yet confirmed
								percentageProgress = totalGoal === 'Unlimited' ? 0 : (totalRaised / totalGoal) * 100
							}
							
							// Update the state variables with the accumulated values
							updateRaised(campaign.campaignId, totalRaised)
							updateGoal(campaign.campaignId, totalGoal)
							updateToGo(campaign.campaignId, totalToGo)
							updatePercentage(campaign.campaignId, percentageProgress)
							updateDonated(campaign.campaignId, totalDonated)
						})
					})									
				.catch((error) => {
					console.error('An error occurred while fetching pool data:', error)
				})
			})
		}
	}, [chain, campaigns, isConnected, activeAddress, client])

	return (
		<section className="pt-[5rem]">
			<div className="container mx-auto p-6">
				<div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 text-center lg:items-center lg:justify-between">
					<h1 className="font-lora font-semibold text-4xl lg:text-[60px] lg:leading-[76.8px] text-[#042940]">
						Campaigns
					</h1>
					<p className="font-semibold font-openSans text-[15px] md:text-[20px] mt-6 text-[#005C53] ">
						Small contributions make a big impact
					</p>
					<hr className="w-48 h-[8px] mx-auto bg-[#9FC131] border-0 rounded-[20px] mt-5" />
				</div>
				<div className="flex flex-row flex-wrap md:gap-10 justify-center ">
					{campaigns.map((campaign) => {
						const expiryTimestamp = Number(campaign.expiryTimestamp)*1000
						return (
							// eslint-disable-next-line react/jsx-key
							<div
								key={campaign.campaignId}
								className="max-w-sm mb-10 bg-[#DEEFE7] border border-gray-200 rounded-[16px] shadow-md">
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
												isExpired(expiryTimestamp)
													? 'bg-[#005C53] text-white'
													: 'bg-[#DBF227] text-green-[#042940]'
											}
											text-2xs pt-1 pl-2 w-[320px] h-[40px] rounded-tr-[3.75rem] text-left
										`}>
											{expiryTimestamp && (
												<span className="mt-1 inline-block align-middle">
													<b>
														{isExpired(expiryTimestamp)
															? 'Completed'
															: 'Expiry:'}
													</b>
													{isExpired(expiryTimestamp)
														? null
														: ` ${formatDate(expiryTimestamp)}`}
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
									{(chain && chain.id === chainConfig.chainId) ? (
										<Progress
											className=" mb-3 rounded-[15px]"
											style={{ background: '#D6D58E' }}
											colorScheme="green"
											height="22px"
											value={percentage[campaign.campaignId]}>
											<ProgressLabel className="text-2xl flex flex-start">
												<Text fontSize="xs" marginLeft="0.5rem">
													{percentage[campaign.campaignId]?.toFixed(1)}%
												</Text>
											</ProgressLabel>
										</Progress>
									) : (
										<div className="h-[30px]"></div>
									)}

									{isConnected ? (
										<>
											{chain.id === chainConfig.chainId ? (
												// Conditional rendering based on whether campaign is completed or not. If completed,
												// only "Goal" and "Raised" will be shown. If on-going, then "To go" will also show.
												<div className="grid grid-cols-3 text-center divide-x-[1px] divide-[#005C53] mb-3">
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Goal
														</dt>
														<dd className="font-normal text-base text-[#042940]">
															{goal[campaign.campaignId] === 'Unlimited'
																? goal[campaign.campaignId]
																: `$${Number(goal[campaign.campaignId]).toFixed(
																		0
																  )}`}
														</dd>
													</div>
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Raised
														</dt>
														<dd className="font-normal text-base text-[#042940]">
															${Number(raised[campaign.campaignId]).toFixed(0)}
														</dd>
													</div>
													{/* Add "Donated" box  */}
													{!isExpired(expiryTimestamp) ? (
														<div className="flex flex-col items-center justify-center">
															<dt className="mb-2 font-medium text-xl text-[#042940]">
																To Go
															</dt>
															<dd className="font-normal text-base text-[#042940]">
																{toGo[campaign.campaignId] === 'Unlimited'
																	? toGo[campaign.campaignId]
																	: `$${Number(
																			toGo[campaign.campaignId]
																	  ).toFixed(0)}`}
															</dd>
														</div>
													) : (
														<div className="flex flex-col items-center justify-center">
															<dt className="mb-2 font-medium text-xl text-[#042940]">
																Donated
															</dt>
															<dd className="font-normal text-base text-[#042940]">
																$
																{donated[campaign.campaignId]
																	? donated[campaign.campaignId].toFixed(0)
																	: 0}
															</dd>
														</div>
													)}
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
														onClick={connectWallet}>
														connect
													</button>
												</span>
												{` to the ${chainConfig.name} network.`}
											</div>
										</div>
									)}

									<Link href={campaign.path}>
										<button
											type="button"
											className="text-white bg-[#042940] hover:bg-blue-700 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
											View Campaign
										</button>
									</Link>
								</div>
							</div>
						)
					})}

					<div className="min-h-[648px] max-w-sm max-h-xl mb-10 p-5 justify-center items-center text-center bg-[#DEEFE7] border border-gray-200 rounded-2xl shadow-md">
						<div className="flex flex-col items-center justify-center h-full">
							{' '}
							<h5 className="mb-2 text-2xl font-bold text-[#042940]">
								More campaigns coming soon!
							</h5>
							<p className="mb-3 font-normal text-[#000000]">
								Get in touch with us to list your campaign
							</p>
							<Link href="mailto: wladimir.weinbender@divadonate.xyz">
								<button className="inline-block font-openSans rounded-lg px-4 py-1.5 text-base font-semibold text-[#042940] ring-1 ring-[#042940]">
									Contact Us
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
