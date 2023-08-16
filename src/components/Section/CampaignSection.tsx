import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import {DivaABI, DivaABIold, ERC20ABI} from '../../abi'
import { formatUnits } from 'ethers/lib/utils'
import { useAccount, useSwitchNetwork, useProvider, useNetwork, useBalance } from 'wagmi'
import { useERC20Contract } from '../../utils/hooks/useContract'
import { Text, Progress, ProgressLabel } from '@chakra-ui/react'
import { fetchToken, getContract } from '@wagmi/core'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import AddToMetamaskIcon from '../AddToMetamaskIcon'
import campaigns from '../../../config/campaigns.json'
import { divaContractAddressOld, divaContractAddress } from "../../constants"; // @todo remove when migrated to campaigns.json
import { chainConfig } from "../../constants";
import { formatDate, isExpired } from '../../utils/general';

/**
 * @notice Campaign section on the Home page
 */
export const CampaignSection = () => {
	const [goal, setGoal] = useState<any>({}) // @todo move type up here from bottom
	const [raised, setRaised] = useState<any>({})
	const [toGo, setToGo] = useState<any>({})
	const [donated, setDonated] = useState<any>({})
	const [percentage, setPercentage] = useState<any>({})
	const [expiryTime, setExpiryTime] = useState<any>('')

	const [decimals, setDecimals] = useState(6)
	const { address: activeAddress, isConnected, connector } = useAccount()
	const collateralTokenAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
	const { chain } = useNetwork()
	const wagmiProvider = useProvider()
	const { openConnectModal } = useConnectModal()

	const { switchNetwork } = useSwitchNetwork()

	const firstCampaign = campaigns.find(campaign => campaign.campaignId === "pastoralists_1");

	const usdtTokenContract = useERC20Contract(collateralTokenAddress)
	const [chainId, setChainId] = React.useState<number>(0)
	const handleOpen = () => {
		switchNetwork?.(chainConfig.chainId)
	}

	const updateRaised = (campaignId: string, tokenAmount: number) => {
		setRaised((prev: any) => ({
			...prev,
			[campaignId]: tokenAmount.toFixed(0),
		}))
	}

	const updateToGo = (campaignId: string, tokenAmount: number | string) => {
		setToGo((prev: any) => ({
			...prev,
			[campaignId]: typeof tokenAmount === 'number' ? tokenAmount.toFixed(0) : tokenAmount,
		}))
	}
	const updateGoal = (campaignId: string, tokenAmount: any) => {
		setGoal((prev: any) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	}

	const updateExpiryDate = (campaignId: string, expiryTimeInMilliseconds: number) => {
		setExpiryTime((prev: any) => ({
			...prev,
			[campaignId]: expiryTimeInMilliseconds,
		}))
	}

	const updateDonated = (campaignId: string, tokenAmount: number) => {
		setDonated((prev: any) => ({
			...prev,
			[campaignId]: tokenAmount,
		}))
	} 

	const updatePercentage = (campaignId: string, percentage: any) => {
		setPercentage((prev: any) => ({
			...prev,
			[campaignId]: percentage,
		}))
	}	

	const handleAddToMetamask = async (campaign: any) => {
			const provider = new ethers.providers.Web3Provider((window as any).ethereum)
			
			for (const pool of campaign.pools) {
				const token = new ethers.Contract(pool.positionToken, ERC20ABI, provider.getSigner())
				const decimal = await token.decimals()
				const symbol = await token.symbol()													
			
				try {
					await (window as any).ethereum.request({
						method: 'wallet_watchAsset',
						params: {
							type: 'ERC20',
							options: {
								address: pool.positionToken,
								symbol: symbol,
								decimals: decimal,
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

	const isUnlimited = (amount: BigNumber): boolean => {
		return amount.eq(ethers.constants.MaxUint256)
	}

	useEffect(() => {
		if (chain) {
			setChainId(chain.id)
		}
	}, [chain])

	useEffect(() => {
		const getDecimals = async () => {
			if (chainId === chainConfig.chainId && usdtTokenContract != null) {
				const decimals = await usdtTokenContract.decimals()
				setDecimals(decimals)
			}
		}
		getDecimals()

		let goalAmount: number | 'Unlimited'
		let toGoAmount: number | 'Unlimited'
		let raisedAmount: number
		let donatedAmount: number
		let percentage: number

		if (chainId === chainConfig.chainId &&
			activeAddress != null &&
			typeof window != 'undefined' &&
			typeof window?.ethereum != 'undefined'
		) {
			const divaContract = getContract({
				address: divaContractAddress,
				abi: DivaABI,
				signerOrProvider: wagmiProvider,
			})
			const divaContractOld = getContract({
				address: divaContractAddressOld,
				abi: DivaABIold,
				signerOrProvider: wagmiProvider,
			})

			// Update state variables for all campaigns

			divaContractOld.getPoolParameters(firstCampaign?.pools[0].poolId).then((res: any) => {
				if (firstCampaign) {
					updateExpiryDate(firstCampaign.campaignId, Number(res.expiryTime) * 1000)

							// Use overwrite if one exists in `campaigns.json`. `raised` is the only statistics
							// that can be overwritten because `collateralBalance` is net of redemptions and will decrease
							// when donors claim back their funds.
							// @todo Using collateralBalance as the amount raised assumes that all the liquidity
							// added will have the beneficiary as the position token recipient. However, as anyone can add
							// liquidity with any other recipient, collateralBalance may not reflect the actual amount raised
							// for the campaign. Use TheGraph to derive the correct value.
							raisedAmount = firstCampaign.raised !== ""
								? Number(firstCampaign.raised) : Number(formatUnits(res.collateralBalance, decimals))
							updateRaised(firstCampaign.campaignId, raisedAmount)

							// @todo Obtain data from pool parameters / the graph if not available
							donatedAmount = firstCampaign.donated !== "" ? Number(firstCampaign.donated) : 0

							// Set variables that depend on whether `res.capacity` is unlimited or not
							if (isUnlimited(res.capacity)) {
								goalAmount = 'Unlimited'
								toGoAmount = 'Unlimited'
								percentage = 0							
							} else {
								goalAmount = Number(formatUnits(res.capacity, decimals))
								toGoAmount = goalAmount - raisedAmount
								percentage = raisedAmount / goalAmount * 100
							}
							updateGoal(firstCampaign.campaignId, goalAmount)
							updateToGo(firstCampaign.campaignId, toGoAmount)
							updatePercentage(firstCampaign.campaignId, percentage)
							updateDonated(firstCampaign.campaignId, donatedAmount)
				}
			}).then(
				campaigns.forEach((campaign, index) => {
					if (campaign.campaignId !== 'pastoralists_1') {
						return divaContract.getPoolParameters(campaign.pools[0].poolId).then((res: any) => {
							updateExpiryDate(campaign.campaignId, Number(res.expiryTime) * 1000)

							// Use overwrite if one exists in `campaigns.json`. `raised` is the only statistics
							// that can be overwritten because `collateralBalance` is net of redemptions and will decrease
							// when donors claim back their funds.
							// @todo Using collateralBalance as the amount raised assumes that all the liquidity
							// added will have the beneficiary as the position token recipient. However, as anyone can add
							// liquidity with any other recipient, collateralBalance may not reflect the actual amount raised
							// for the campaign. Use TheGraph to derive the correct value.
							raisedAmount = campaign.raised !== ""
								? Number(campaign.raised) : Number(formatUnits(res.collateralBalance, decimals))
							updateRaised(campaign.campaignId, raisedAmount)

							// @todo Obtain data from pool parameters / the graph if not available
							donatedAmount = campaign.donated !== "" ? Number(campaign.donated) : 0

							// Set variables that depend on whether `res.capacity` is unlimited or not
							if (isUnlimited(res.capacity)) {
								goalAmount = 'Unlimited'
								toGoAmount = 'Unlimited'
								percentage = 0							
							} else {
								goalAmount = Number(formatUnits(res.capacity, decimals))
								toGoAmount = goalAmount - raisedAmount
								percentage = raisedAmount / goalAmount * 100
							}
							updateGoal(campaign.campaignId, goalAmount)
							updateToGo(campaign.campaignId, toGoAmount)
							updatePercentage(campaign.campaignId, percentage)
							updateDonated(campaign.campaignId, donatedAmount)
						})
					}
				})
			)
		}
	}, [chainId, decimals, wagmiProvider, campaigns])


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
					{
						campaigns.map((campaign, index) => {
							return (
								// eslint-disable-next-line react/jsx-key
								<div className="max-w-sm mb-10 bg-[#DEEFE7] border border-gray-200 rounded-[16px] shadow-md">
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
																{goal[campaign.campaignId] === 'Unlimited' ? goal[campaign.campaignId] : '$' + goal[campaign.campaignId]}
															</dd>
														</div>
														<div className="flex flex-col items-center justify-center">
															<dt className="mb-2 font-medium text-xl text-[#042940]">
																Raised
															</dt>
															<dd className="font-normal text-base text-[#042940]">
																${raised[campaign.campaignId]}
															</dd>
														</div>
														{/* Add "Donated" box  */}
														{!isExpired(expiryTime[campaign.campaignId]) ? (
															<div className="flex flex-col items-center justify-center">
																<dt className="mb-2 font-medium text-xl text-[#042940]">
																	To go
																</dt>
																<dd className="font-normal text-base text-[#042940]">
																	{toGo[campaign.campaignId] === 'Unlimited' ? toGo[campaign.campaignId] : '$' + toGo[campaign.campaignId]}
																</dd>
															</div>
														) : (
															<div className="flex flex-col items-center justify-center">
																<dt className="mb-2 font-medium text-xl text-[#042940]">
																	Donated
																</dt>
																<dd className="font-normal text-base text-[#042940]">
																${0}
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
															onClick={openConnectModal}>
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
