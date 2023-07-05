'use client'
import { ethers } from 'ethers'
import {DivaABI, DivaABIold, ERC20ABI} from '../../abi'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount, useNetwork } from 'wagmi'
import { useERC20Contract } from '../../utils/hooks/useContract'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { getTokenBalance } from '../../utils/general'
import { Progress, ProgressLabel, Text } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import pools from '../../../config/pools.json'
import {getShortenedAddress} from "../../utils/general";
import {getContract} from "@wagmi/core";

export default function Donations() {
	const divaContractAddress = '0x2C9c47E7d254e493f02acfB410864b9a86c28e1D'
	const [redeemLoading, setRedeemLoading] = useState(false)
	const [donated, setDonated] = useState<any>()
	const [balance, setBalance] = useState<any>(null)
	const [percentage, setPercentage] = useState<any[]>([])
	const [expiryDate, setExpiryDate] = useState<any>('')
	const [decimals, setDecimals] = useState(8)
	const [claimEnabled, setClaimEnabled] = useState()
	const { address: activeAddress, isConnected } = useAccount()
	const collateralTokenAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
	const { chain } = useNetwork()
	const { openConnectModal } = useConnectModal()
	const usdtTokenContract = useERC20Contract(collateralTokenAddress)

	const [chainId, setChainId] = React.useState('0')
	const handleOpen = () => {
		;(window as any as any).ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0x89' }],
		})
	}

	useEffect(() => {
		if (chain) {
			setChainId(ethers.utils.hexlify(chain.id))
		}
	}, [chain])
	const updateBalance = (poolId: string, tokenAmount: number) => {
		setBalance((prevBalance: any) => ({
			...prevBalance,
			[poolId]: tokenAmount,
		}));
	};

	const updateClaimEnabled = (poolId: string, enabled: boolean) => {
		setClaimEnabled((prevEnabled: any) => ({
			...prevEnabled,
			[poolId]: enabled,
		}));
	};

	const updateDonated = (poolId: string, value: any) => {
		setDonated((prevDonated: any) => ({
			...prevDonated,
			[poolId]: value,
		}));
	};

	const updateExpiryDate = (poolId: string, date: any) => {
		setExpiryDate((prevDate: any) => ({
			...prevDate,
			[poolId]: date,
		}));
	};

	useEffect(() => {
		const getDecimals = async () => {
			if (chainId === '0x89' && usdtTokenContract != null) {
				const decimals = await usdtTokenContract.decimals();
				setDecimals(decimals);
			}
		};
		getDecimals();
		if (
			chainId === '0x89' &&
			activeAddress != null &&
			pools != null &&
			typeof window !== 'undefined' &&
			typeof window.ethereum !== 'undefined'
		) {
			const provider = new ethers.providers.Web3Provider(window.ethereum as any);
			const divaContract = new ethers.Contract(
				divaContractAddress,
				DivaABI,
				provider.getSigner()
			);
			const divaContractOld = new ethers.Contract(
				'0xFf7d52432B19521276962B67FFB432eCcA609148',
				DivaABIold,
				provider.getSigner()
			);

			pools.forEach((pool) => {
					const tokenContract = new ethers.Contract(
						pool.positionToken,
						ERC20ABI,
						provider.getSigner()
					);
					getTokenBalance(tokenContract, activeAddress).then((result) => {
						const tokenAmount = Number(
							formatUnits(result?.balance, result?.decimals)
						);
						if (tokenAmount === 0) {
							updateClaimEnabled(pool.poolId, false);
						} else {
							updateClaimEnabled(pool.poolId, true);
						}
						updateBalance(pool.poolId, tokenAmount);
					});
			});

			if (balance != null) {
				divaContractOld.getPoolParameters(8).then((res: any) => {
					console.log(res.payoutLong)
					if (res.payoutLong.gt(0)) {
						updateClaimEnabled('8', true);
					} else {
						updateClaimEnabled('8', false);
					}
					updateDonated('8', formatUnits(
						res.payoutShort.mul(parseUnits(balance['8']?.toString(), decimals))
					));
					updateExpiryDate('8', new Date(Number(res.expiryTime) * 1000).toLocaleDateString(
						undefined,
						{
							day: 'numeric',
							month: 'short',
							year: 'numeric',
							hour: '2-digit',
							hour12: true,
							timeZoneName: 'short',
						}
					));
				});

				pools.forEach((pool) => {
					if (pool.poolId !== '8' && balance[pool.poolId]) {
						divaContract.getPoolParameters(pool.poolId).then((res: any) => {
							if (res.payoutLong.gt(0)) {
								updateClaimEnabled(pool.poolId, true);
							} else {
								updateClaimEnabled(pool.poolId, false);
							}
							updateDonated(pool.poolId, formatUnits(
								res.payoutShort.mul(parseUnits(balance[pool.poolId]?.toString(), decimals))
							));
							updateExpiryDate(pool.poolId, new Date(Number(res.expiryTime) * 1000).toLocaleDateString(
								undefined,
								{
									day: 'numeric',
									month: 'short',
									year: 'numeric',
									hour: '2-digit',
									hour12: true,
									timeZoneName: 'short',
								}
							));
						});
					}
				});
			}
		}
	}, [chainId, decimals, activeAddress, pools, !balance, claimEnabled == null]);


	return (
		<div className="pt-[5rem] pb-[200px] sm:pt-[8rem] md:pt-[8rem] my-auto mx-auto px-4">
			{chainId === '0x89' && isConnected && (<div className="pb-10 flex flex-col items-center justify-center">
				<h1 className="font-lora text-[60px]">My Donations</h1>
				<div
					className="bg-[#9FC131] w-[200px] text-xs font-medium text-blue-100 text-center p-0.5 leading-none ">
					{' '}
				</div>
			</div>)}
			<div className="flex flex-row gap-10 justify-center">
			{pools.map((pool) => {
				if (balance != undefined && balance[pool.poolId] > 0) {
				return (
					// eslint-disable-next-line react/jsx-key
						<div
							className="max-w-sm mb-10 bg-[#DEEFE7] border border-gray-200 rounded-[16px] shadow-md ">
							<a href="#">
								<Image
									className="h-[300px] rounded-t-[16px] object-cover"
									width="800"
									height="800"
									src={pool.img}
									alt="Modern building architecture"
								/>
								<div className="relative -mt-10">
									<div
										className="text-2xs pt-1 pl-2 bg-[#DBF227] w-[320px] h-[40px] rounded-tr-[3.75rem] text-left text-green-[#042940]">
									<span className="mt-1 inline-block align-middle">
										<b>Expiry:</b> {expiryDate[pool.poolId]}
									</span>
									</div>
								</div>
							</a>
							<div className="p-5">
								<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-[#042940]">
									Fortune DIVA
								</h5>
								<div className="text-indigo-600 flex items-center dark:text-indigo-400">
									<span className="text-slate-400 font-normal">#{getShortenedAddress(pool.poolId)}</span>
									<Link onClick={
										async () => {
											const provider = new ethers.providers.Web3Provider((window as any).ethereum)
											const token = new ethers.Contract(pool.positionToken, ERC20ABI, provider.getSigner())
											const decimal = await token.decimals()
											const symbol = await token.symbol()
											console.log(pool.positionToken, decimal, symbol)
											try {
												await (window as any).ethereum.request({
													method: 'wallet_watchAsset',
													params: {
														type: 'ERC20',
														options: {
															address: pool.positionToken,
															symbol: symbol,
															decimals: decimal,
														},
													} as any,
												})
											} catch (error) {
												console.error('Error in HandleAddMetaMask', error)
											}
										}
									} href="">
										<svg
											width="16"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											className="ml-2">
											<g clipPath="url(#clip0_270_567)">
												<path
													d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346629 6.40034 -0.15496 8.00888 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9977 5.87897 15.1541 3.84547 13.6543 2.34568C12.1545 0.845886 10.121 0.00229405 8 0V0ZM10.6667 8.66667H8.66667V10.6667C8.66667 10.8435 8.59643 11.013 8.47141 11.1381C8.34638 11.2631 8.17682 11.3333 8 11.3333C7.82319 11.3333 7.65362 11.2631 7.5286 11.1381C7.40358 11.013 7.33334 10.8435 7.33334 10.6667V8.66667H5.33334C5.15653 8.66667 4.98696 8.59643 4.86193 8.47141C4.73691 8.34638 4.66667 8.17681 4.66667 8C4.66667 7.82319 4.73691 7.65362 4.86193 7.5286C4.98696 7.40357 5.15653 7.33333 5.33334 7.33333H7.33334V5.33333C7.33334 5.15652 7.40358 4.98695 7.5286 4.86193C7.65362 4.73691 7.82319 4.66667 8 4.66667C8.17682 4.66667 8.34638 4.73691 8.47141 4.86193C8.59643 4.98695 8.66667 5.15652 8.66667 5.33333V7.33333H10.6667C10.8435 7.33333 11.0131 7.40357 11.1381 7.5286C11.2631 7.65362 11.3333 7.82319 11.3333 8C11.3333 8.17681 11.2631 8.34638 11.1381 8.47141C11.0131 8.59643 10.8435 8.66667 10.6667 8.66667Z"
													fill="#898989"
												/>
											</g>
											<defs>
												<clipPath id="clip0_270_567">
													<rect width="16" height="16" fill="white"/>
												</clipPath>
											</defs>
										</svg>
									</Link>
								</div>

								<div className=" h-[100px] mb-5 border-b-2 border-[#9FC131]">
									<p className="mb-3 font-normal text-[#000000]">
										{pool.desc}
									</p>
								</div>

								{/*<Progress*/}
								{/*	className=" mb-3 rounded-[20px]"*/}
								{/*	style={{ background: '#D6D58E' }}*/}
								{/*	colorScheme="green"*/}
								{/*	height="22px"*/}
								{/*	value={percentage}>*/}
								{/*	<ProgressLabel className="text-2xl flex flex-start">*/}
								{/*		<Text fontSize="xs">{percentage}%</Text>*/}
								{/*	</ProgressLabel>*/}
								{/*</Progress>*/}

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
				{chainId === '0x89' && balance?.length == 0 && isConnected ? (
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
			) : chainId !== '0x89' && (
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
