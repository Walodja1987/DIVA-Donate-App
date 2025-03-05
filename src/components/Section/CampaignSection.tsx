'use client';

// Nextjs
import Image from 'next/image'
import Link from 'next/link'

// React
import React, { useEffect, useState, useMemo } from 'react'

// Query
import { useQueries } from '@tanstack/react-query';
import request from 'graphql-request'

// viem
import { formatUnits } from 'viem'

// ABIs
import { DivaABI, DivaABIold, ERC20ABI } from '@/abi'

// Chakra
import { Text, Progress, ProgressLabel } from '@chakra-ui/react'

// Assets
import AddToMetamaskIcon from '@/components/AddToMetamaskIcon'

// constants
import campaigns from '../../../config/campaigns.json'
import { divaContractAddressOld, chainConfigs } from '@/constants'

// Utils
import { formatDate, isExpired, isUnlimited } from '@/utils/general'

// Types
import type { Pool, StatusSubgraph } from '@/types/poolTypes'
import type { Campaign, CampaignStatus } from '@/types/campaignTypes'
import type { DIVALiquidityResponse } from '@/types/subgraphTypes'

// Wagmi
import { wagmiConfig } from '@/componentts/wagmiConfig'
import { readContract } from '@wagmi/core'

// Subgraph queries
import { queryDIVALiquidity } from '@/queries/divaSubgraph'

/**
 * @notice This component displays the list of ongoing and completed campaigns on the Home page.
 */
export const CampaignSection = () => {
	const [campaignStats, setCampaignStats] = useState<{
		[campaignId: string]: {
		  goal: number | 'Unlimited',
		  raised: number,
		  toGo: number | 'Unlimited',
		  donated: number,
		  percentageRaised: number,
		  percentageDonated: number,
		  expiryTimestamp: number,
		  status: CampaignStatus,
		  percentageProgressBar: number
		}
	  }>({})

	// @todo Duplicated in Donations component. Move into general.tsx
	const handleAddToMetamask = async (campaign: any) => {
		for (const pool of campaign.pools) {
			const divaContract = {
				address: campaign.divaContractAddress,
				abi: campaign.divaContractAddress === divaContractAddressOld
					? DivaABIold
					: DivaABI,
				chainId: Number(campaign.chainId) as 137 | 42161 | 1
			} as const

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore: Temporarily ignore type error, fix later
			const poolParams = await readContract(wagmiConfig, {
				...divaContract,
				functionName: 'getPoolParameters',
				args: [pool.poolId]
			}) as Pool

			const donorPositionToken: `0x${string}` =
				pool.beneficiarySide === 'short'
					? poolParams.longToken
					: poolParams.shortToken

			const tokenContract = {
				address: donorPositionToken,
				abi: ERC20ABI,
				chainId: Number(campaign.chainId) as 137 | 42161 | 1
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

	// Group pool IDs by chain ID. Using the `reduce` method on the campaigns array to iterate
	// over all campaigns and accumulate a result.
	// Example output:
	// {
	// 	"137": ["0x12...9ab", "0x45...567"],
	// 	"42161": ["0xde...234"]
	// }
	// useMemo hook with an empty dependency array is used to compute poolIdsByChain only once, when the component mounts.
  const poolIdsByChain = useMemo(() => {
	return campaigns.reduce((acc, campaign) => {
	  const chainId = Number(campaign.chainId)
	  // Check if there's already an entry for this chain ID in our accumulator.
	  if (!acc[chainId]) {
		acc[chainId] = []
	  }
	  // Add all pool IDs from this campaign to the array for this chain ID.
	  acc[chainId].push(...campaign.pools.map(pool => pool.poolId as `0x${string}`))
	  return acc
	}, {} as { [chainId: number]: `0x${string}`[] })
  }, [])

  // Create a query for each chain. Using useQueries hook to perform multiple queries in parallel
  // in case there are multiple chains.
  // The result, chainQueries, is an array of query results, one for each chain.
  // Each query result object contains properties like data, isLoading, isError, etc., which we can use to handle the state of each query.
  const chainQueries = useQueries({
	// Iterate over each chain and its pool IDs, creating a query configuration for each chain.
	// Object.entries returns an array of key-value pairs, where each pair is a chain ID and its corresponding pool IDs array.
	// Example:
	// [
	// 	[137, ["0x12...9ab", "0x45...567"]],
	// 	[42161, ["0xde...234"]]
	// ]
    queries: Object.entries(poolIdsByChain).map(([chainId, poolIds]) => ({
		// Set unique identifier for the query.
      queryKey: ['divaLiquidityData', chainId, poolIds],
	  // Define the query function that fetches the data for the given chain and pool IDs.
      queryFn: async () => {
        const response = await request<DIVALiquidityResponse>(
          chainConfigs[Number(chainId)].graphUrl,
          queryDIVALiquidity(poolIds)
        )
		// console.log(`Response for chain ${chainId}:`, response);
        return response.liquidities || []
      }
    }))
  })

  // Check if any of the queries are still loading or if there was an error.
  const isLoading = chainQueries?.some(query => query.isLoading)
  const isError = chainQueries?.some(query => query.isError)

  const fetchCampaignStatsFromDIVASubgraph = () => {
      // Combine liquidity event data from all chain queries into a single array
      const allLiquidityEventData = chainQueries.flatMap(query => query.data || []);

      // Check if we have any data to process
      if (allLiquidityEventData.length === 0) {
        console.log("No liquidity event data available");
        return {};
      }
    
      // Initialize an object to store the new stats for each campaign
      const newStats = {} as typeof campaignStats;

      // Iterate through each campaign
      campaigns.forEach((campaign: Campaign) => {
        // Get all pool IDs associated with this campaign
        const campaignPoolIds = campaign.pools.map(pool => pool.poolId);

		// Initialize an array to store statusFinalReferenceValue for each pool associated with a campaign
		const poolStatusMap: { [poolId: `0x${string}`]: StatusSubgraph } = {};

        // Filter liquidity event data to only include events for this campaign's pools
        const campaignLiquidityEvents = allLiquidityEventData.filter(data => campaignPoolIds.includes(data.pool.id));

        // Initialize counters for campaign statistics
        let totalRaised = 0;
        let totalDonated = 0;
        let totalGoal: number | 'Unlimited' = 0;
        let totalToGo: number | 'Unlimited' = 0;

        // Iterate through each liquidity event for this campaign
        campaignLiquidityEvents.forEach((data) => { // @todo add type so that we no longer need to cast to BigInt when using formatUnits
			// Log statusFinalReferenceValue for each pool associated with the campaign.
			// Campaigns that are associated with multiple pools, the statusFinalReferenceValue may be different
			// for each pool for a short period of time.
			const poolId = data.pool.id;
			poolStatusMap[poolId] = data.pool.statusFinalReferenceValue as StatusSubgraph;

          // Only consider 'Added' or 'Issued' events
          if (data.eventType === 'Added' || data.eventType === 'Issued') {
            const decimals = Number(campaign.decimals);

            // Convert collateral amount to a number, considering decimals
            const amount = Number(formatUnits(BigInt(data.collateralAmount), decimals));

            // Check if the poolId in the liquidity event data matches one of the poolIds associated with the campaign
            const pool = campaign.pools.find(p => p.poolId === poolId);
            
            if (pool) {
              // Check if the shortTokenHolder or the longTokenHolder inside the liquidity event under consideration
              // matches the donationtRecipient for the campaing.
              // Note that for now, we only assume that there is only one donation recipient. Update this part if
              // it ever changes.
              const isDonationRecipient = pool.beneficiarySide === 'short'
                ? campaign.donationRecipients[0].address.toLowerCase() === data.shortTokenHolder.toLowerCase()
                : campaign.donationRecipients[0].address.toLowerCase() === data.longTokenHolder.toLowerCase();

              if (isDonationRecipient) {
                // Only add to totalRaised if the short or long token matches the donation recipient
                totalRaised += amount;

                // Calculate payout based on the beneficiary side.
                // Will be always zero as long as the pool is not confirmed (statusFinalReferenceValue !== 3).
                const payout = pool.beneficiarySide === 'short'
                  ? Number(formatUnits(BigInt(data.pool.payoutShort), decimals))
                  : Number(formatUnits(BigInt(data.pool.payoutLong), decimals));
                
                // Add to total donated amount, considering the payout
                totalDonated += amount * payout;
              }
            }

            // Update goal and to-go amounts, handling 'Unlimited' case
            if (isUnlimited(data.pool.capacity) || totalGoal === 'Unlimited') {
              totalGoal = 'Unlimited';
              totalToGo = 'Unlimited';
            } else {
              const poolCapacity = Number(formatUnits(BigInt(data.pool.capacity), decimals));
              if (typeof totalGoal === 'number') {
                totalGoal += poolCapacity;
                totalToGo = totalGoal - totalRaised;
              }
            }
          }
        });

        // Check for overwrites in `campaign.json`
        if (campaign.raised !== '') {
          totalRaised = Number(campaign.raised);
        }
        if (campaign.goal !== '') {
          totalGoal = Number(campaign.goal);
          totalToGo = totalGoal - totalRaised;
        }
        if (campaign.donated !== '') {
          totalDonated = Number(campaign.donated);
        }
    
        // Calculate progress percentage
        const percentageRaisedProgress = typeof totalGoal === 'number' && totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0;
		const percentageDonatedProgress = typeof totalRaised === 'number' && totalRaised > 0 ? (totalDonated / totalRaised) * 100 : 0;

		  // Determine the campaign status. Note that aLl pools associated with the campaign must be confirmed in order for the campaing to be considered confirmed.
		  let campaignStatus: CampaignStatus;
		  const isExpiredCampaign = isExpired(Number(campaign.expiryTimestamp)*1000);
		  const allPoolsConfirmed = Object.values(poolStatusMap).every(status => status === 'Confirmed');

		  // Similar logic as in Donations.tsx
		let currentStatus: CampaignStatus;
		if (!isExpiredCampaign) {
			currentStatus = 'Ongoing';
		} else if (allPoolsConfirmed) {
			currentStatus = 'Completed';
		} else {
			currentStatus = 'Expired';
		}

		if (campaignStatus === 'Completed' && currentStatus !== 'Completed') {
			campaignStatus = currentStatus;
		} else {
			campaignStatus = currentStatus;
		}

		// Percentage progress bar to be displayed in the campaign card.
		// If the campaign is completed, then the percentage progress bar is the percentage of the donations.
		// If the campaign is ongoing or expired but not yet completed, then the percentage progress bar is the percentage of the raised amount.
		const percentageProgressBar = campaignStatus === 'Completed' ? percentageDonatedProgress : percentageRaisedProgress;

        newStats[campaign.campaignId] = {
          goal: totalGoal,
          raised: totalRaised,
          toGo: totalToGo,
          donated: totalDonated,
          percentageRaised: percentageRaisedProgress,
		  percentageDonated: percentageDonatedProgress,
		  expiryTimestamp: Number(campaign.expiryTimestamp)*1000,
		  status: campaignStatus,
		  percentageProgressBar: percentageProgressBar
        };
		// console.log("campaign.id", campaign.campaignId)
		// console.log("goal", totalGoal)
		// console.log("raised", totalRaised)
		// console.log("toGo", totalToGo)
		// console.log("donated", totalDonated)
		// console.log("percentageRaisedProgress", percentageRaisedProgress)
		// console.log("percentageDonatedProgress", percentageDonatedProgress)
		// console.log("status", campaignStatus)
		// console.log("percentageProgressBar", percentageProgressBar)
      });

      return newStats;

  }

  useEffect(() => {
	if (!isLoading && !isError) {
	  const newStats = fetchCampaignStatsFromDIVASubgraph();
	  setCampaignStats(newStats);
	} else if (isLoading) {
	  console.log("Loading campaign data...");
	} else if (isError) {
	  console.log("Error in fetching campaign data");
	}
  }, [isLoading, isError]);


  if (isLoading) return <div>Loading campaign data...</div>
  if (isError) return <div>Error loading campaign data</div>

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
												campaignStats[campaign.campaignId]?.status !== 'Ongoing'
													? 'bg-[#005C53] text-white'
													: 'bg-[#DBF227] text-green-[#042940]'
											}
											text-2xs pt-1 pl-2 w-[320px] h-[40px] rounded-tr-[3.75rem] text-left
										`}>
											{campaignStats[campaign.campaignId]?.expiryTimestamp && (
												<span className="mt-1 inline-block align-middle">
													<b>
														{campaignStats[campaign.campaignId]?.status !== 'Ongoing'
															? 'Completed'
															: 'Expiry:'}
													</b>
													{campaignStats[campaign.campaignId]?.status !== 'Ongoing'
														? null
														: ` ${formatDate(campaignStats[campaign.campaignId]?.expiryTimestamp)}`}
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
										<Progress
											className=" mb-3 rounded-[15px]"
											style={{ background: '#D6D58E' }}
											colorScheme="green"
											height="22px"
											value={campaignStats[campaign.campaignId]?.percentageProgressBar}>
											<ProgressLabel className="text-2xl flex flex-start">
												<Text fontSize="xs" marginLeft="0.5rem">
												{campaignStats[campaign.campaignId]?.percentageProgressBar?.toFixed(1)}%
												</Text>
											</ProgressLabel>
										</Progress>
										<>
											<div className="grid grid-cols-2 text-center divide-x-[1px] divide-[#005C53] mb-3">
												{campaignStats[campaign.campaignId]?.status !== 'Completed' ? (
													// For Ongoing or Expired campaigns
												<>
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Goal
														</dt>
														<dd className="font-normal text-base text-[#042940]">
															{campaignStats[campaign.campaignId]?.goal === 'Unlimited'
																? campaignStats[campaign.campaignId]?.goal
																: `$${Number(campaignStats[campaign.campaignId]?.goal).toFixed(0)}`}
														</dd>
													</div>
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Raised
														</dt>
														<dd className="font-normal text-base text-[#042940]">
															${Number(campaignStats[campaign.campaignId]?.raised).toFixed(0)}
														</dd>
													</div>
												</>
												) : (
													// For Completed campaigns
												<>
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Raised
														</dt>
														<dd className="font-normal text-base text-[#042940]">
															${Number(campaignStats[campaign.campaignId]?.raised).toFixed(0)}
														</dd>
													</div>
													<div className="flex flex-col items-center justify-center">
														<dt className="mb-2 font-medium text-xl text-[#042940]">
															Donated
														</dt>
														<dd className="font-normal text-base text-[#042940]">
															${campaignStats[campaign.campaignId]?.donated
															? Number(campaignStats[campaign.campaignId]?.donated).toFixed(0)
															: '0'}
														</dd>
													</div>
												</>
												)}
											</div>
											</>

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
							<Link href="mailto: wladimir.weinbender@divatech.ch">
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
