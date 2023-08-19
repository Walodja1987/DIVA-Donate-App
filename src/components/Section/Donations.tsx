'use client'
import { ethers } from 'ethers'
import {DivaABI, DivaABIold, ERC20ABI} from '../../abi'
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
import { divaContractAddressOld } from "../../constants";
import { formatDate, isExpired } from "../../utils/general";
import { chainConfig } from "../../constants";
import { getContract } from "@wagmi/core";

export default function Donations() {
	const divaContractAddress = '0x2C9c47E7d254e493f02acfB410864b9a86c28e1D' // @todo remove
	const [redeemLoading, setRedeemLoading] = useState(false)
	const [donated, setDonated] = useState<{ [campaignId: string]: number }>({}) // @todo update type
	const [campaignBalance, setCampaignBalance] = useState<{ [campaignId: string]: number }>({})
	const [poolBalance, setPoolBalance] = useState<{ [poolId: string]: number }>({})
	const [percentage, setPercentage] = useState<any[]>([]) // @todo update type
	const [expiryTime, setExpiryTime] = useState<{ [campaignId: string]: number }>({})
	const [decimals, setDecimals] = useState(8) // @todo read from campaign.json
	const [claimEnabled, setClaimEnabled] = useState<{ [campaignId: string]: boolean }>({})
	const { address: activeAddress, isConnected } = useAccount()
	const collateralTokenAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' // @todo replace
	const { chain } = useNetwork()
	const wagmiProvider = useProvider()
	const { openConnectModal } = useConnectModal()
	const { switchNetwork } = useSwitchNetwork()
	const usdtTokenContract = useERC20Contract(collateralTokenAddress) // @todo replace

	const [chainId, setChainId] = React.useState<number>(0) // @todo Question: Needed if wagmi's useNetwork() hook is used?

	// ----------------------------
	// Event handlers
	// ----------------------------
	// const handleOpen = () => {
	// 	;(window as any as any).ethereum.request({
	// 		method: 'wallet_switchEthereumChain',
	// 		params: [{ chainId: chainConfig.chainId }],
	// 	})
	// }

	// 
	const handleOpen = () => {
		switchNetwork?.(chainConfig.chainId)
	}

	useEffect(() => {
		if (chain) {
			setChainId(chain.id)
		}
	}, [chain])

	const updateCampaignBalance = (campaignId: string, tokenAmount: number) => {
		setCampaignBalance((prev) => ({
			...prev,
			[campaignId]: tokenAmount,
		}));
	};

	const updatePoolBalance = (poolId: string, tokenAmount: number) => {
		setPoolBalance((prev) => ({
			...prev,
			[poolId]: tokenAmount,
		}));
	};

	const updateClaimEnabled = (campaignId: string, enabled: boolean) => {
		setClaimEnabled((prev) => ({
			...prev,
			[campaignId]: enabled,
		}));
	};

	const updateDonated = (campaignId: string, value: number) => {
		setDonated((prev) => ({
			...prev,
			[campaignId]: value,
		}));
	};

	const updateExpiryTime = (campaignId: string, expiryTimeInMilliseconds: number) => {
		setExpiryTime((prev) => ({
			...prev,
			[campaignId]: expiryTimeInMilliseconds,
		}));
	};

	// @todo Duplicated in CampaignSection component. Move into general.tsx
	const handleAddToMetamask = async (campaign: any) => {		
		for (const pool of campaign.pools) {
			const token = getContract({
				address: pool.positionToken,
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
							address: pool.positionToken,
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

			campaigns.forEach(campaign => {
				// More efficient to simply store the decimals in `campaigns.json` rather than doing many RPC requests
				const decimals = campaign.decimals

				// Connect to corresponding contract. Note that the first campaign was using a pre-audited
				// version of the DIVA Protocol contract. All subsequent campaigns are using the audited final version.
				const divaContract = getContract({
					address: campaign.divaContractAddress,
					abi: campaign.divaContractAddress === divaContractAddressOld ? DivaABIold : DivaABI,
					signerOrProvider: wagmiProvider,
				})

				// Check the user's position token balances for the campaigns in order to determine, which
				// campaigns to show on the page
				Promise.all(
					campaign.pools.map(pool => {
						// It's ok to pull the balance of the position token that the beneficiary received
						// as it's the same amount that the donor received of the opposite token
						const positionTokenContract = getContract({
							address: pool.positionToken,
							abi: ERC20ABI,
							signerOrProvider: wagmiProvider,
						})

						return getTokenBalance(positionTokenContract, activeAddress).then(res => {
							const balance = Number(formatUnits(res?.balance, decimals))
							updatePoolBalance(pool.poolId, balance)
							return {
								campaignId: campaign.campaignId,
								poolId: pool.poolId,
								balance: balance
							}
						})
					})					
				).then(tokenData => {
					const sumTokenBalance = Number(formatUnits(tokenData.reduce((acc, data) => acc.add(data.balance), ethers.BigNumber.from(0)), decimals))
					updateCampaignBalance(campaign.campaignId, sumTokenBalance)

					Promise.all(
						tokenData.map(pool => {
							return divaContract.getPoolParameters(pool.poolId).then((res: any) => {
								return {
									campaignId: pool.campaignId,
									poolId: pool.poolId,
									balance: pool.balance,
									expiryTime: res.expiryTime,
									payoutLong: res.payoutLong,
									payoutShort: res.payoutShort
								}
							})
						})
					).then(data => {
						// Assumes that `expiryTime` for all linked pools is the same.
						// `campaignId` is the same for all items in the `data` array, hence it's
						// ok to use the `campaignId` of the first item (`data[0]`)
						updateExpiryTime(data[0].campaignId, Number(data[0].expiryTime) * 1000)
						const sumDonated = Number(formatUnits(data.reduce((acc, data) => acc.add(data.payoutShort.mul(data.balance)), ethers.BigNumber.from(0)), decimals))
						updateDonated(campaign.campaignId, sumDonated)

						// if (balance != null) {
						// divaContract.getPoolParameters(campaign.campaignId).then((res: any) => {
						// 	if (res.payoutLong.gt(0)) {
						// 		updateClaimEnabled(campaign.campaignId, true);
						// 	} else {
						// 		updateClaimEnabled(campaign.campaignId, false);
						// 	}
						// 	// updateDonated(campaign.campaignId, Number(formatUnits(
						// 	// 	res.payoutShort.mul(balance[campaign.campaignId] ? parseUnits(balance[campaign.campaignId]?.toString(), decimals) : ethers.BigNumber.from(0))
						// 	// )));
						// 	// updateExpiryTime(campaign.campaignId, Number(res.expiryTime) * 1000);
						// })
						// }
					})
				})
		}
	}, [chainId, decimals, activeAddress, pools, !campaignBalance, claimEnabled == null]);


	return (
		<div className="pt-[5rem] pb-[200px] sm:pt-[8rem] md:pt-[8rem] my-auto mx-auto px-4">
			{chainId === chainConfig.chainId && isConnected && (<div className="pb-10 flex flex-col items-center justify-center">
				<h1 className="font-lora text-[60px]">My Donations</h1>
				<div
					className="bg-[#9FC131] w-[200px] text-xs font-medium text-blue-100 text-center p-0.5 leading-none ">
					{' '}
				</div>
			</div>)}
			<div className="flex flex-row gap-10 justify-center">
			{campaigns.map((campaign) => {
				if (campaignBalance != undefined && campaignBalance[campaign.campaignId] > 0) {
				return (
					// eslint-disable-next-line react/jsx-key
						<div
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

								<div className="grid grid-cols-2 text-center divide-x-[1px] divide-[#005C53] mb-3">
									<div className="flex flex-col items-center justify-center">
										<dt className="mb-2 font-medium text-xl text-[#042940]">
											Committed
										</dt>

										<dd className="font-normal text-base text-[#042940] ">
											${balance && !isNaN(balance[pool.poolId]) ? Number(balance[pool.poolId]).toFixed(2) : 0.00}
										</dd>
									</div>
									<div className="flex flex-col items-center justify-center">
										<dt className="mb-2 font-medium text-xl text-[#042940]">
											Donated
										</dt>
										<dd className="font-normal text-base text-[#042940] ">
											${donated && !isNaN(donated[pool.poolId]) ? Number(donated[pool.poolId]).toFixed(2) : 0.00}
										</dd>
									</div>
								</div>
								{redeemLoading ? (
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
										<span className="sr-only">Loading...</span>
									</div>
								) : (
									<button
										disabled={claimEnabled ? claimEnabled[pool.poolId] : true}
										onClick={
											async () => {
												const provider = new ethers.providers.Web3Provider(
													(window as any).ethereum
												)
												const diva = pool.poolId === '8' ? new ethers.Contract(
													divaContractAddress,
													DivaABIold,
													provider.getSigner()
												) :  new ethers.Contract(
													divaContractAddress,
													DivaABI,
													provider.getSigner()
												)

												const longTokenContract = new ethers.Contract(
													pool.positionToken,
													ERC20ABI,
													provider.getSigner()
												)

												const longTokenBalance = await longTokenContract.balanceOf(activeAddress)

												setRedeemLoading(true)
												// @todo Implement batchRedeemPositionToken
												diva
													.redeemPositionToken(pool.positionToken, longTokenBalance)
													.then((tx: any) => {
														tx.wait()
															.then(() => {
																setRedeemLoading(false)
																console.log('success')
															})
															.catch((err: any) => {
																setRedeemLoading(false)
																console.log(err)
															})
													})
													.catch((err: any) => {
														setRedeemLoading(false)
														console.log(err)
													})
											}

										}
										type="button"
										className="disabled:hover:bg-[#042940] disabled:opacity-25 text-white bg-[#042940] hover:bg-blue-700 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
										Claim Donated Amount
									</button>
								)}
							</div>
						</div>

			// }
				)
			}
			})}
			</div>
				{chainId === chainConfig.chainId && balance?.length == 0 && isConnected ? (
				<div className="pb-[23rem] flex flex-col items-center justify-center">
					<h1 className="font-lora text-[60px]">My Donations</h1>
					<div className="bg-[#9FC131] w-[200px] text-xs font-medium text-blue-100 text-center p-0.5 leading-none ">
						{' '}
					</div>
					<p className="mt-[140px]">{`You have already claimed your donations or you haven't made any donations yet`}</p>
					<Link href="/">
						<button
							type="button"
							className="mt-10 text-white bg-[#042940] hover:bg-blue-700 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
							Explore Campaigns
						</button>
					</Link>
				</div>
			) : chainId !== chainConfig.chainId && (
				<div className="flex flex-col items-center justify-center ">
					<h1 className="font-lora text-[60px]">My Donations</h1>
					<div className="bg-[#9FC131] w-[200px] text-xs font-medium text-blue-100 text-center p-0.5 leading-none ">
						{' '}
					</div>
					{isConnected ? (
						<div className="pt-10 flex items-center justify-center">
							Please{' '}
							<span>
								<button className="p-2 text-blue-600" onClick={handleOpen}>
									{' '}
									connect
								</button>
							</span>{' '}
							to the Polygon network.
						</div>
					) : (
						<div className="mb-10 flex flex-col items-center justify-center pt-10">
							<div className=" flex items-center justify-center">
								Please{' '}
								<span>
									<button
										className="p-2 text-blue-600"
										onClick={openConnectModal}>
										connect
									</button>
								</span>{' '}
								Wallet.
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
