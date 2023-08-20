import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import {DivaABI, DivaABIold, ERC20ABI} from '../../abi'
import { formatUnits } from 'ethers/lib/utils'
import { useAccount, useSwitchNetwork, useProvider, useNetwork } from 'wagmi'
import { useERC20Contract } from '../../utils/hooks/useContract'
import { Text, Progress, ProgressLabel } from '@chakra-ui/react'
import { fetchToken, getContract } from '@wagmi/core'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import AddToMetamaskIcon from '../AddToMetamaskIcon'
import campaigns from '../../../config/campaigns.json'
import { divaContractAddressOld } from "../../constants";
import { chainConfig } from "../../constants";
import { formatDate, isExpired, isUnlimited } from '../../utils/general';

// @todo I think it would be better to use toFixed inside jsx only and not store the values
// in that format. It's less of a problem if the values are not used for calculations, but if they are
// used, then it's problematic. Consider adjusting.

/**
 * @notice Campaign section on the Home page
 */
export const CampaignSection = () => {
	const [goal, setGoal] = useState<{ [campaignId: string]: number | 'Unlimited' }>({})
	const [raised, setRaised] = useState<{ [campaignId: string]: number }>({})
	const [toGo, setToGo] = useState<{ [campaignId: string]: number | 'Unlimited' }>({})
	const [donated, setDonated] = useState<{ [campaignId: string]: number }>({})
	const [percentage, setPercentage] = useState<{ [campaignId: string]: number }>({})
	const [expiryTime, setExpiryTime] = useState<{ [campaignId: string]: number }>({})

	const { address: activeAddress, isConnected, connector } = useAccount()
	const { chain } = useNetwork()
	const wagmiProvider = useProvider()
	const { openConnectModal } = useConnectModal()
	const { switchNetwork } = useSwitchNetwork()
	const [chainId, setChainId] = React.useState<number>(0)

	// ----------------------------
	// Event handlers
	// ----------------------------
	const handleOpen = () => {
		switchNetwork?.(chainConfig.chainId)
	}

	const updateRaised = (campaignId: string, tokenAmount: number) => {
		setRaised((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}

	const updateToGo = (campaignId: string, tokenAmount: number | 'Unlimited') => {
		setToGo((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}
	const updateGoal = (campaignId: string, tokenAmount: number | 'Unlimited') => {
		setGoal((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}

	const updateExpiryTime = (campaignId: string, expiryTimeInMilliseconds: number) => {
		setExpiryTime((prev) => ({
			...prev,
			[campaignId]: expiryTimeInMilliseconds,
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
				const divaContract = getContract({
					address: campaign.divaContractAddress,
					abi: campaign.divaContractAddress === divaContractAddressOld ? DivaABIold : DivaABI,
					signerOrProvider: wagmiProvider,
				})
	
				const poolParams = await divaContract.getPoolParameters(pool.poolId)
				const donorPositionToken = pool.beneficiarySide === 'short' ? poolParams.longToken : poolParams.shortToken
	
				const token = getContract({
					address: donorPositionToken,
					abi: ERC20ABI,
					signerOrProvider: wagmiProvider
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

	useEffect(() => {
		if (chain) {
			setChainId(chain.id)
		}
	}, [chain])

	// Update state variables for all campaigns in `campaigns.json`
	useEffect(() => {
		if (chainId === chainConfig.chainId &&
			activeAddress != null &&
			typeof window != 'undefined' &&
			typeof window?.ethereum != 'undefined'
		) {			
			campaigns.forEach(campaign => {
				let goalAmount: number | 'Unlimited' = 0
				let toGoAmount: number | 'Unlimited' = 0
				let raisedAmount: number = 0
				let donatedAmount: number = 0
				let percentage: number = 0

				// More efficient to simply store the decimals in `campaigns.json` rather than doing many RPC requests
				const decimals = campaign.decimals

				// Connect to corresponding contract. Note that the first campaign was using a pre-audited
				// version of the DIVA Protocol contract. All subsequent campaigns are using the audited final version.
				const divaContract = getContract({
					address: campaign.divaContractAddress,
					abi: campaign.divaContractAddress === divaContractAddressOld ? DivaABIold : DivaABI,
					signerOrProvider: wagmiProvider,
				})

				// Iterate through each pool listed under each campaign's pools array and aggregate the statistics.
				// Create an array to store promises for each getPoolParameters call.
				const poolPromises = campaign.pools.map((pool, index) => {
					return divaContract.getPoolParameters(pool.poolId).then((res: any) => {
						if (index === 0) {
							// Update only once. This assumes that the expiry time is the same for all
							// pools linked under the campaign. Could be improved further down the road.
							updateExpiryTime(campaign.campaignId, Number(res.expiryTime) * 1000)
						}
			
						// Use overwrite if one exists in `campaigns.json`. `raised` is the only statistics
						// that can be overwritten because `collateralBalance` is net of redemptions and will decrease
						// when donors claim back their funds.
						// @todo Using collateralBalance as the amount raised assumes that all the liquidity
						// added will have the beneficiary as the position token recipient. However, as anyone can add
						// liquidity with any other recipient, collateralBalance may not reflect the actual amount raised
						// for the campaign. Use TheGraph to derive the correct value.
						raisedAmount = campaign.raised !== ""
							? Number(campaign.raised) // Overwrite is defined on campaign level, hence no aggregation needed
							: raisedAmount + Number(formatUnits(res.collateralBalance, decimals)) // Accumulate raisedAmount for each pool 
						
						// @todo Consider adding an additional field called "Overwrites" in `campaign.json` where raised and donated are placed.
						// Update campaignTypes.d.ts accordingly and the code in here.

						// @todo Retrieve data from pool parameters / the graph if not available
						donatedAmount = campaign.donated !== "" ? Number(campaign.donated) : 0  // Overwrite is defined on campaign level, hence no aggregation needed
			
						// Set variables that depend on whether `res.capacity` is unlimited or not
						if (isUnlimited(res.capacity)) {
							goalAmount = 'Unlimited'
							toGoAmount = 'Unlimited'
							percentage = 0
						} else {
							// Assumes that within a single campaign, the pools have either unlimited or limited
							// capacity but not a mix. If it's mixed, then `Number(goalAmount)` will throw. Added
							// alert below to make sure that this case is logged in the console.
							goalAmount = Number(goalAmount) + Number(formatUnits(res.capacity, decimals))

							// Log alert message if a campaign has pools with mixed capacities (unlimited and limited)
							goal[campaign.campaignId] === 'Unlimited' && console.log('ALERT: The pools within a campaign have mixed capacities, consisting of both unlimited and limited capacities.')
							toGoAmount = Number(goalAmount) - raisedAmount
							percentage = raisedAmount / goalAmount * 100
						}

						// @todo Question: return the different variables here rather than having them defined as "let" at the top?
					});
				});
			
				// Wait for all poolPromises to resolve and then update the state with aggregated values
				Promise.all(poolPromises).then(() => {
					updateRaised(campaign.campaignId, raisedAmount)
					updateGoal(campaign.campaignId, goalAmount)
					updateToGo(campaign.campaignId, toGoAmount)
					updatePercentage(campaign.campaignId, percentage)
					updateDonated(campaign.campaignId, donatedAmount)
				});
			})
		}
	}, [chainId, wagmiProvider, campaigns])


	return (
		<section className="pt-[5rem]">
			<div className="container mx-auto p-6">
				<div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 text-center lg:items-center lg:justify-between">
					<h1 className="font-lora font-semibold text-[30px] md:text-[60px] leading-[76.8px] text-[#042940]">
						Campaigns
					</h1>
					<p className="font-semibold font-openSans text-[15px] md:text-[20px] mt-6 text-[#005C53] ">
						Small contributions make a big impact
					</p>
					<hr className="w-48 h-[8px] mx-auto bg-[#9FC131] border-0 rounded-[20px] mt-5" />
				</div>
				<div className="flex flex-row gap-10 justify-center ">
					{campaigns.map((campaign) => {
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
											${expiryTime[campaign.campaignId] && isConnected ? '' : 'invisible'} // Add 'invisible' class conditionally
											${isExpired(expiryTime[campaign.campaignId]) ? 'bg-[#005C53] text-white' : 'bg-[#DBF227] text-green-[#042940]'}
											text-2xs pt-1 pl-2 w-[320px] h-[40px] rounded-tr-[3.75rem] text-left
										`}
										>
										{expiryTime[campaign.campaignId] && (
											<span className="mt-1 inline-block align-middle">
											<b>{isExpired(expiryTime[campaign.campaignId]) ? 'Completed' : 'Expiry:'}</b>
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
										<Progress
											className=" mb-3 rounded-[15px]"
											style={{ background: '#D6D58E' }}
											colorScheme="green"
											height="22px"
											value={percentage[campaign.campaignId]}>
											<ProgressLabel className="text-2xl flex flex-start">
												<Text fontSize="xs" marginLeft="0.5rem">{percentage[campaign.campaignId]?.toFixed(1)}%</Text>
											</ProgressLabel>
										</Progress>
									) : <div className="h-[30px]"></div>}

									{isConnected ? (
										<>
											{chainId === chainConfig.chainId ? (
												// Conditional rendering based on whether campaign is completed or not. If completed,
												// only "Goal" and "Raised" will be shown. If on-going, then "To go" will also show.
												<div className="grid grid-cols-3 text-center divide-x-[1px] divide-[#005C53] mb-3">
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Goal
														</dt>
														<dd className="font-normal text-base text-[#042940]">
															{goal[campaign.campaignId] === 'Unlimited' ? goal[campaign.campaignId] : `$${Number(goal[campaign.campaignId]).toFixed(0)}`}
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
													{!isExpired(expiryTime[campaign.campaignId]) ? (
														<div className="flex flex-col items-center justify-center">
															<dt className="mb-2 font-medium text-xl text-[#042940]">
																To Go
															</dt>
															<dd className="font-normal text-base text-[#042940]">
																{toGo[campaign.campaignId] === 'Unlimited' ? toGo[campaign.campaignId] : `$${Number(toGo[campaign.campaignId]).toFixed(0)}`}
															</dd>
														</div>
													) : (
														<div className="flex flex-col items-center justify-center">
															<dt className="mb-2 font-medium text-xl text-[#042940]">
																Donated
															</dt>
															<dd className="font-normal text-base text-[#042940]">
															${donated[campaign.campaignId].toFixed(0)}
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
																onClick={handleOpen}
															>
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
														onClick={openConnectModal}
													>
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
					})
				}


					<div className="max-w-sm max-h-xl mb-10 p-5 justify-center items-center text-center bg-[#DEEFE7] border border-gray-200 rounded-[16px] shadow-md ">
						<div className="justify-center mt-[17rem]">
							{' '}
							<h5 className="mb-2 text-2xl font-bold text-gray-900 text-[#042940]">
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
