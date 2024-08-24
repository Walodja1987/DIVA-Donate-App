'use client'

// Nextjs
import Image from 'next/image'
import Link from 'next/link'

// React
import React, { useEffect, useState, useMemo } from 'react'

// Query
import { useQueries } from '@tanstack/react-query';
import request from 'graphql-request'

// ABIs
import { DivaABI, DivaABIold, ERC20ABI } from '@/abi'

// Privy
import { usePrivy, useWallets } from '@privy-io/react-auth';

// viem
import { formatUnits, parseUnits } from 'viem'

// Assets
import AddToMetamaskIcon from '../AddToMetamaskIcon'

// constants
import campaigns from '../../../config/campaigns.json'
import { divaContractAddressOld, divaContractAddress, chainConfig, chainConfigs } from '@/constants'

// Utils
import { formatDate, isExpired } from '@/utils/general'

// Types
import { CampaignPool, Campaign, CampaignStatus } from '@/types/campaignTypes'
import { Pool, Status, StatusSubgraph } from '@/types/poolTypes'
import { DIVALiquidityResponse } from '@/types/subgraphTypes'

// Chakra
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
	Progress,
	ProgressLabel,
	Text
} from '@chakra-ui/react'

// Wagmi
import { wagmiConfig } from '@/components/wagmiConfig'
import { useAccount } from 'wagmi'
import { 
	simulateContract,
	readContract,
	readContracts,
	writeContract,
	waitForTransactionReceipt,
	getChains,
	multicall,
	type WriteContractReturnType,
	type ReadContractReturnType,
	type ReadContractsParameters
} from '@wagmi/core'

// Subgraph queries
import { queryDIVALiquidity } from '@/queries/divaSubgraph'

export default function Donations() {
	// const [redeemLoading, setRedeemLoading] = useState<{
	// 	[campaignId: string]: boolean
	// }>({})
	// const [donated, setDonated] = useState<{ [campaignId: string]: number }>({})
	// const [campaignBalance, setCampaignBalance] = useState<{
	// 	[campaignId: string]: number
	// }>({})
	// const [percentageDonated, setPercentageDonated] = useState<{
	// 	[campaignId: string]: number
	// }>({})
	// const [claimEnabled, setClaimEnabled] = useState<{
	// 	[campaignId: string]: boolean
	// }>({})
	// const [campaignsParticipated, setCampaignsParticipated] = useState(0)
	// const [statusFinalReferenceValue, setStatusFinalReferenceValue] = useState<{
	// 	[campaignId: string]: Status
	// }>({})

	const [donationStats, setDonationStats] = useState<{
		[campaignId: string]: {
		  donated: number,
		  campaignBalance: number,
		  percentageDonated: number,
		  claimEnabled: boolean,
		  status: CampaignStatus
		}
	  }>({})
	  
	  const [campaignsParticipated, setCampaignsParticipated] = useState(0)
	  
	  // RedeemLoading state defined by campaign so that the loading wheel only appears for the campaign that is being redeemed
	  const [redeemLoading, setRedeemLoading] = useState<{
		[campaignId: string]: boolean
	  }>({})

	// Privy hooks
	const {ready, user, authenticated, login, connectWallet, logout, linkWallet} = usePrivy();
	const {wallets, ready: walletsReady} = useWallets();
	const wallet = wallets[0] // active/connected wallet

	const { address: activeAddress, isConnected, chain, chainId } = useAccount()

	// const [chainId, setChainId] = React.useState<number>(0) // @todo Question: Needed if wagmi's useNetwork() hook is used?

	const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })

	// // Get the name of the campaign chain to display in the switch wallet message inside the DonationCard component
	// const chains = getChains(wagmiConfig)
	// const campaignChainId = Number(campaign.chainId)
	// const campaignChainName = chains.find((chain) => chain.id === campaignChainId)?.name
	
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
			queryKey: ['divaLiquidityData', chainId, poolIds, activeAddress],
		  	  // Define the query function that fetches the data for the given chain and pool IDs.
			queryFn: async () => {
			const response = await request<DIVALiquidityResponse>(
			  chainConfigs[chainId].graphUrl,
			  queryDIVALiquidity(poolIds, activeAddress)
			)
			return response.liquidities || []
		  },
		  enabled: !!activeAddress
		}))
	  })

	  // Check if any of the queries are still loading or if there was an error.
	const isLoading = chainQueries?.some(query => query.isLoading)
	const isError = chainQueries?.some(query => query.isError)

	// const fetchDonationStatsFromDIVASubgraph = () => {
    //     // Combine liquidity event data from all chain queries into a single array
	// 	const allLiquidityEventData = chainQueries.flatMap(query => query.data || []);

	// 	// Check if we have any data to process
    //     if (allLiquidityEventData.length === 0) {
    //       console.log("No outstanding donations found for address ", activeAddress);
    //       return { stats: {}, countCampaignsParticipated: 0 };
    //     }

	// 	// Initialize a counter for the number of campaigns the user has participated in
	// 	let countCampaignsParticipated = 0;
		
	// 	// Initialize an object to store the stats for each campaign
    //     const stats = {} as typeof donationStats; 

	// 	// Iterate through each campaign
    //     campaigns.forEach((campaign: Campaign) => {
	// 		// Get all pool IDs associated with this campaign
    //       const campaignPoolIds = campaign.pools.map(pool => pool.poolId);

	// 	  // Initialize an array to store statusFinalReferenceValue for each pool associated with a campaign
	// 	  const poolStatusMap: { [poolId: `0x${string}`]: StatusSubgraph } = {};

	// 	  // Filter liquidity event data to only include events for this campaign's pools
    //       const campaignLiquidityEvents = allLiquidityEventData.filter(data => campaignPoolIds.includes(data.pool.id));

	// 	  // Initialize counters for campaign statistics
    //       let campaignBalance = 0;
    //       let donated = 0;

	// 	  // Iterate through each liquidity event for the campaign
    //       campaignLiquidityEvents.forEach((data) => {
	// 		// Log statusFinalReferenceValue for each pool associated with the campaign.
	// 		// Campaigns that are associated with multiple pools, the statusFinalReferenceValue may be different
	// 		// for each pool for a short period of time.
	// 		const poolId = data.pool.id;
	// 		if (!(poolId in poolStatusMap)) {
	// 			poolStatusMap[poolId] = data.pool.statusFinalReferenceValue as StatusSubgraph;
	// 		}

    //         if (data.eventType === 'Added' || data.eventType === 'Issued') {
	// 			const decimals = Number(campaign.decimals);

	// 			// Convert collateral amount to a number, considering decimals
	// 			const amount = Number(formatUnits(BigInt(data.collateralAmount), decimals));
				
	// 			// Add the amount to the campaign balance
	// 			campaignBalance += amount;
				
	// 			// Check if the poolId in the liquidity event data matches one of the poolIds associated with the campaign
    //           const pool = campaign.pools.find(p => p.poolId === data.pool.id);
              
	// 		  // Calculate payout based on the beneficiary side.
    //             // Will be always zero as long as the pool is not confirmed (statusFinalReferenceValue !== 3).
	// 		  if (pool) {
    //             const payout = pool.beneficiarySide === 'short'
    //               ? Number(formatUnits(BigInt(data.pool.payoutShort), decimals))
    //               : Number(formatUnits(BigInt(data.pool.payoutLong), decimals));
                
    //             donated += amount * payout;
    //           }
    //         }

	// 		// Store the status for each pool
	// 		poolStatusMap[data.pool.id] = data.pool.statusFinalReferenceValue as StatusSubgraph;
    //       });

    //       if (campaignBalance > 0) {
    //         countCampaignsParticipated++;

	// 		// Determine the campaign status. Note that aLl pools associated with the campaign must be confirmed in order for the campaing to be considered confirmed.
	// 		let campaignStatus: CampaignStatus;
	// 		const isExpiredCampaign = isExpired(Number(campaign.expiryTimestamp)*1000);
	// 		const allPoolsConfirmed = Object.values(poolStatusMap).every(status => status === 'Confirmed');

	// 		if (isExpiredCampaign) {
	// 			if (allPoolsConfirmed) {
	// 			  campaignStatus = 'Completed';
	// 			} else {
	// 			  campaignStatus = 'Expired';
	// 			}
	// 		  } else {
	// 			campaignStatus = 'Ongoing';
	// 		  }

    //         stats[campaign.campaignId] = {
    //           campaignBalance,
    //           donated,
    //           percentageDonated: (donated / campaignBalance) * 100,
    //           claimEnabled: allPoolsConfirmed && campaignBalance * 0.997 - donated > 0,
    //           status: campaignStatus
    //         };
    //       }
    //     });

    //     // setDonationStats(stats);
    //     // setCampaignsParticipated(countCampaignsParticipated);
	// 	return { stats, countCampaignsParticipated };
    //   };

	//   useEffect(() => {
	// 	if (!isLoading && !isError && activeAddress) {
	// 	  const { stats, countCampaignsParticipated } = fetchDonationStatsFromDIVASubgraph();
	// 	  setDonationStats(stats);
	// 	  setCampaignsParticipated(countCampaignsParticipated);
	// 	} else if (isLoading) {
	// 	  console.log("Loading donation data...");
	// 	} else if (isError) {
	// 	  console.log("Error in fetching donation data");
	// 	}
	//   }, [isLoading, isError, activeAddress]);

	const handleSwitchNetwork = async (campaignChainId: number) => {
		await wallet.switchChain(campaignChainId);
	}

	type TokenInfo = {
		donorToken: `0x${string}`;
		chainId: 137 | 42161;
		campaignId: string;
		poolId: `0x${string}`;
	  };
	  
	// @notice Fetches the balances of the donor tokens for all campaigns for the connected wallet.
	const fetchDonorTokenBalances = async (userAddress: `0x${string}`) => {
		// For each campaign in `campaign.json`, extract the donorToken from the `pools` field and other relevant information
		// including chainId, campaignId, and poolId needed for further processing.
		// Example:
		// [
		//   {
		//     donorToken: "0xabc...",
		//     chainId: 137,
		//     campaignId: "pastoralists_1",
		//     poolId: "0x123..."
		//   },
		//   {
		//     donorToken: "0xdef...",
		//     chainId: 137,
		//     campaignId: "pastoralists_2",
		//     poolId: "0x456..."
		//   }
		// ]
		const tokenInfos: TokenInfo[] = campaigns.flatMap(campaign => 
		  campaign.pools.map(pool => ({
			donorToken: pool.donorToken as `0x${string}`,
			chainId: Number(campaign.chainId) as 137 | 42161,
			campaignId: campaign.campaignId,
			poolId: pool.poolId as `0x${string}`
		  }))
		);
		
		// Create an array of contract calls for all chains
		// Example:
		// [
		//   {
		//     address: "0xabc...",
		//     abi: ERC20ABI,
		//     functionName: 'balanceOf',
		//     args: ["0x1234..."],
		//     chainId: 137
		//   },
		//   {
		//     address: "0xdef...",
		//     abi: ERC20ABI,
		//     functionName: 'balanceOf',
		//     args: ["0x1234..."],
		//     chainId: 42161
		//   }
		// ]
		const allContracts = tokenInfos.map(tokenInfo => ({
		  address: tokenInfo.donorToken,
		  abi: ERC20ABI,
		  functionName: 'balanceOf',
		  args: [userAddress],
		  chainId: tokenInfo.chainId
		} as const)) as ReadContractsParameters["contracts"];
			
		// Initialize variable to store balances for each campaign and poolId. Having the poolId will be useful
		// when querying the DIVA subgraph.
		// Example:
		// const balances = {
		//   "pastoralists_1": {
		//     "0x123...": 1000000000000000000n
		//   },
		//   "pastoralists_2": {
		//     "0x456...": 500000000000000000n,
		//     "0x789...": 750000000000000000n
		//   },
		//   "test_ongoing_dUSD_arbitrum": {
		//     "0xabc...": 250000000000000000n
		//   }
		// };
		const balances: { [campaignId: string]: { [poolId: `0x${string}`]: bigint } } = {};
		
		try {
		  const results = await readContracts(wagmiConfig, {
			contracts: allContracts,
			allowFailure: false,
		  });
	
		  console.log("Results from all chains:", results);
	
		  // Process results
		  results.forEach((result, index) => {
			const { campaignId, poolId } = tokenInfos[index];
			console.log(`Result for campaign ${campaignId}, pool ${poolId}:`, result);
	
			if (!balances[campaignId]) {
			  balances[campaignId] = {};
			}
			balances[campaignId][poolId] = result as bigint;
		  });
	
		  console.log("Final balances:", balances);
	
		} catch (error) {
		  console.error("Error fetching balances for all chains:", error);
		  
		  // Set balances to 0 for all tokens if there was an error
		  tokenInfos.forEach(({ campaignId, poolId }) => {
			if (!balances[campaignId]) {
			  balances[campaignId] = {};
			}
			balances[campaignId][poolId] = BigInt(0);
			console.log(`Set balance to 0 for campaign ${campaignId}, pool ${poolId}`);
		  });
		}
		
		return balances;
	  };

	useEffect(() => {
		if (activeAddress) {
		  const fetchBalances = async () => {
			try {
			  const balances = await fetchDonorTokenBalances(activeAddress);
			  console.log('Donor token balances:', balances);
			} catch (error) {
			  console.error('Error fetching donor token balances:', error);
			}
		  };
	  
		  fetchBalances();
		}
	  }, [activeAddress]);


	// ///// NEWWWW 
	// // Fetch all the campaigns from the subgraph that the user has donated to.
	// const getUserCampaigns = (liquidityEventData: any[], campaigns: Campaign[]) => {
	// 	// Create a unique collection of all pool IDs the user has interacted with
	// 	// Only consider "Added" or "Issued" events
	// 	const userPoolIds = new Set(
	// 	  liquidityEventData
	// 		.filter(event => event.eventType === 'Added' || event.eventType === 'Issued')
	// 		.map(event => event.pool.id)
	// 	);
	  
	// 	// Filter campaigns to only those the user has contributed to
	// 	const userCampaigns = campaigns.filter(campaign => 
	// 	  campaign.pools.some(pool => userPoolIds.has(pool.poolId))
	// 	);
	  
	// 	return userCampaigns;
	// };

	// // Fetch donor token balances for campaigns the user has participated in.
	// const fetchUserDonorTokenBalances = async (userCampaigns: Campaign[], userAddress: `0x${string}`) => {
	// 	// Example output:
	// 	// const balances = {
	// 	// 	"campaign1": {
	// 	// 	  "0x1234567890123456789012345678901234567890": 1000000000000000000n,
	// 	// 	  "0x2345678901234567890123456789012345678901": 500000000000000000n
	// 	// 	},
	// 	// 	"campaign2": {
	// 	// 	  "0x3456789012345678901234567890123456789012": 750000000000000000n
	// 	// 	},
	// 	// 	"campaign3": {
	// 	// 	  "0x4567890123456789012345678901234567890123": 250000000000000000n,
	// 	// 	  "0x5678901234567890123456789012345678901234": 100000000000000000n
	// 	// 	}
	// 	//   };
	// 	const balances: { [campaignId: string]: { [poolId: `0x${string}`]: bigint } } = {};
		
	// 	// Group calls by chainId. Example output:
	// 	// const callsByChain = {
	// 	// 	137: [
	// 	// 	  {
	// 	// 		campaignId: "campaign1",
	// 	// 		poolId: "0x1234567890123456789012345678901234567890",
	// 	// 		call: {
	// 	// 		  address: "0xabcdef1234567890abcdef1234567890abcdef12",
	// 	// 		  abi: ERC20ABI,
	// 	// 		  functionName: "balanceOf",
	// 	// 		  args: ["0x9876543210987654321098765432109876543210"]
	// 	// 		}
	// 	// 	  },
	// 	// 	  {
	// 	// 		campaignId: "campaign2",
	// 	// 		poolId: "0x2345678901234567890123456789012345678901",
	// 	// 		call: {
	// 	// 		  address: "0xbcdef1234567890abcdef1234567890abcdef123",
	// 	// 		  abi: ERC20ABI,
	// 	// 		  functionName: "balanceOf",
	// 	// 		  args: ["0x9876543210987654321098765432109876543210"]
	// 	// 		}
	// 	// 	  }
	// 	// 	],
	// 	// 	42161: [
	// 	// 	  {
	// 	// 		campaignId: "campaign3",
	// 	// 		poolId: "0x3456789012345678901234567890123456789012",
	// 	// 		call: {
	// 	// 		  address: "0xcdef1234567890abcdef1234567890abcdef1234",
	// 	// 		  abi: ERC20ABI,
	// 	// 		  functionName: "balanceOf",
	// 	// 		  args: ["0x9876543210987654321098765432109876543210"]
	// 	// 		}
	// 	// 	  }
	// 	// 	]
	// 	//   };
	// 	const callsByChain: { [chainId: number]: { campaignId: string; poolId: `0x${string}`; call: any }[] } = {};
	  
	// 	userCampaigns.forEach(campaign => {
	// 	// Check if the chainId is already in the callsByChain object. If not, initialize it.
	// 	  const chainId = Number(campaign.chainId);
	// 	  if (!callsByChain[chainId]) {
	// 		callsByChain[chainId] = [];
	// 	  }
	  
	// 	  // 
	// 	  campaign.pools.forEach(pool => {
	// 		callsByChain[chainId].push({
	// 		  campaignId: campaign.campaignId,
	// 		  poolId: pool.poolId as `0x${string}`,
	// 		  call: {
	// 			address: pool.donorToken as `0x${string}`,
	// 			abi: ERC20ABI,
	// 			functionName: 'balanceOf',
	// 			args: [userAddress],
	// 			chainId: Number(campaign.chainId) as 137 | 42161
	// 		  }
	// 		});
	// 	  });
	// 	});
	  
	// 	// Execute multicall for each chain
	// 	for (const [chainId, items] of Object.entries(callsByChain)) {
	// 	  try {
	// 		const results = await multicall(wagmiConfig, {
	// 		  contracts: items.map(c => ({ ...c.call })),
	// 		  allowFailure: false,
	// 		});
	  
	// 		// Process results
	// 		results.forEach((result, index) => {
	// 			// Extract campaignId and poolId from the items element
	// 		  const { campaignId, poolId } = items[index];
	// 		  // If the campaignId doesn't exist in the balances object, initialize it.
	// 		  if (!balances[campaignId]) {
	// 			balances[campaignId] = {};
	// 		  }
	// 		  // Set the balance for the poolId in the campaignId.
	// 		  balances[campaignId][poolId] = result as bigint;
	// 		});
	// 	  } catch (error) {
	// 		console.error(`Error fetching balances for chain ${chainId}:`, error);
	// 		// Set balances to 0 for all calls in this chain if there was an error.
	// 		// In this case, those campaigns will not be displayed.
	// 		items.forEach(({ campaignId, poolId }) => {
	// 		  if (!balances[campaignId]) {
	// 			balances[campaignId] = {};
	// 		  }
	// 		  balances[campaignId][poolId] = BigInt(0);
	// 		});
	// 	  }
	// 	}
	  
	// 	return balances;
	// };

	// const updateCampaignBalance = (campaignId: string, tokenAmount: number) => {
	// 	setCampaignBalance((prev) => ({
	// 		...prev,
	// 		[campaignId]: tokenAmount,
	// 	}))
	// }

	// const updateClaimEnabled = (campaignId: string, enabled: boolean) => {
	// 	setClaimEnabled((prev) => ({
	// 		...prev,
	// 		[campaignId]: enabled,
	// 	}))
	// }

	// const updateStatusFinalReferenceValue = (
	// 	campaignId: string,
	// 	status: Status
	// ) => {
	// 	setStatusFinalReferenceValue((prev) => ({
	// 		...prev,
	// 		[campaignId]: status,
	// 	}))
	// }

	// Updates the loading state for a specific campaign's redeem action.
	// It preserves the loading states of other campaigns while updating the specified one.
	const updateRedeemLoading = (campaignId: string, loading: boolean) => {
		setRedeemLoading((prev) => ({
			...prev,
			[campaignId]: loading,
		}))
	}

	// const updateDonated = (campaignId: string, value: number) => {
	// 	setDonated((prev) => ({
	// 		...prev,
	// 		[campaignId]: value,
	// 	}))
	// }

	// const updatePercentageDonated = (campaignId: string, percentage: number) => {
	// 	setPercentageDonated((prev) => ({
	// 		...prev,
	// 		[campaignId]: percentage,
	// 	}))
	// }

	const handleRedeemPositionToken = async (campaign: Campaign) => {
		const divaContract = {
			address: campaign.divaContractAddress,
			abi: campaign.divaContractAddress === divaContractAddressOld
				? DivaABIold
				: DivaABI,
			chainId: Number(campaign.chainId) as 137 | 42161
		} as const
	
		updateRedeemLoading(campaign.campaignId, true)
	
		try {
			// Get pool parameters for each pool in the campaign.
			const poolData: ReadContractReturnType[] = await Promise.all(
				campaign.pools.map((pool: CampaignPool) =>
					readContract(wagmiConfig, {
						...divaContract,
						functionName: 'getPoolParameters',
						args: [pool.poolId],
					})
				)
			)
	
			// Get user's donor token balances for the pool associated with the campaign.
			// Reading from smart contract hear in order to get the exact balance
			// token balances at the time of redemption.
			const donorTokenBalance = await Promise.all(
				poolData.map(async (pool: Pool) => {
					const donorPositionToken =
						campaign.pools[0].beneficiarySide === 'short'
							? pool.longToken
							: pool.shortToken
	
					const balance = await readContract(wagmiConfig, {
						address: donorPositionToken,
						abi: ERC20ABI,
						functionName: 'balanceOf',
						args: [activeAddress],
					})
	
					return {
						poolData: pool,
						donorPositionToken: donorPositionToken,
						balance: balance,
					}
				})
			)
	
			// Prepare args for `batchRedeemPositionToken` smart contract call.
			const batchRedeemPositionTokenArgs = donorTokenBalance.map((pool) => ({
				positionToken: pool.donorPositionToken,
				amount: pool.balance,
			}))
	
			// First, simulate the contract call. That's the recommended practice in the viem docs:
			// https://viem.sh/docs/contract/writeContract.html#usage
			const { request } = await simulateContract(wagmiConfig, {
				...divaContract,
				functionName: 'batchRedeemPositionToken',
				args: [batchRedeemPositionTokenArgs],
				account: activeAddress,
			})
	
			// If simulation is successful, proceed with the actual transaction
			const hash = await writeContract(wagmiConfig, request)
	
			// Wait for the transaction to be mined
			await waitForTransactionReceipt(wagmiConfig, { hash })
	
			updateRedeemLoading(campaign.campaignId, false)
			onOpen() // Open Success Modal
		} catch (err) {
			console.error('Error in batchRedeemPositionToken transaction:', err)
			updateRedeemLoading(campaign.campaignId, false)
		}
	}

	// @todo Duplicated in CampaignSection component. Move into general.tsx
	const handleAddToMetamask = async (campaign: any) => {
		for (const pool of campaign.pools) {
			const divaContract = {
				address: campaign.divaContractAddress,
				abi: campaign.divaContractAddress === divaContractAddressOld
					? DivaABIold
					: DivaABI,
				chainId: Number(campaign.chainId) as 137 | 42161
			} as const

			const poolParams = await readContract(wagmiConfig, {
				...divaContract,
				functionName: 'getPoolParameters',
				args: [pool.poolId],
			}) as Pool // @todo is the poolType here correct? Not ReadContractReturnType?

			const donorPositionToken: `0x${string}` =
				pool.beneficiarySide === 'short'
					? poolParams.longToken
					: poolParams.shortToken

			const tokenContract = {
				address: donorPositionToken,
				abi: ERC20ABI,
				chainId: Number(campaign.chainId) as 137 | 42161
			} as const

			const decimals = await readContract(wagmiConfig, {
				...tokenContract,
				functionName: 'decimals',
			}) as bigint
			console.log('chainId', Number(campaign.chainId))
			console.log('decimals', decimals)
			const symbol = await readContract(wagmiConfig, {
				...tokenContract,
				functionName: 'symbol',
			}) as string

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
	// 	const fetchPoolData = async () => {
	// 	  for (const campaign of campaigns) {
	// 		const chainId = Number(campaign.chainId) as 137 | 42161;
	// 		console.log(`Fetching data for campaign ${campaign.campaignId} on chain ${chainId}`);
	
	// 		const divaContract = {
	// 		  address: campaign.divaContractAddress as `0x${string}`,
	// 		  abi: campaign.divaContractAddress === divaContractAddressOld && chainId === 137
	// 			? DivaABIold
	// 			: DivaABI,
	// 		  chainId: chainId
	// 		} as const;
	
	// 		try {
	// 		  const poolData = await Promise.all(
	// 			campaign.pools.map((pool: CampaignPool) =>
	// 			  readContract(wagmiConfig, {
	// 				...divaContract,
	// 				functionName: 'getPoolParameters',
	// 				args: [pool.poolId],
	// 			  })
	// 			)
	// 		  );
	
	// 		  console.log(`Pool data for campaign ${campaign.campaignId} on chain ${chainId}:`, poolData);
	// 		} catch (error) {
	// 		  console.error(`Error fetching pool data for campaign ${campaign.campaignId}:`, error);
	// 		}
	// 	  }
	// 	};
	
	// 	fetchPoolData();
	//   }, []);

	// useEffect(() => {
	// 	const fetchPoolData = async () => {
	// 	  // Group contracts by chainId for multicall. The reason is that multicall can only be called on one chain at a time.
	// 	  const contractsByChain = campaigns.reduce((acc, campaign) => {
	// 		const chainId = Number(campaign.chainId) as 137 | 42161;
	// 		if (!acc[chainId]) acc[chainId] = [];
			
	// 		const divaContract = {
	// 		  address: campaign.divaContractAddress as `0x${string}`,
	// 		  abi: campaign.divaContractAddress === divaContractAddressOld && chainId === 137
	// 			? DivaABIold
	// 			: DivaABI,
	// 		  chainId: chainId
	// 		} as const;
	  
	// 		campaign.pools.forEach((pool: CampaignPool) => {
	// 		  acc[chainId].push({
	// 			...divaContract,
	// 			functionName: 'getPoolParameters' as const,
	// 			args: [pool.poolId] as const,
	// 		  });
	// 		});
	  
	// 		return acc;
	// 	  }, {} as Record<137 | 42161, any[]>);
	  
	// 	  for (const [chainId, contracts] of Object.entries(contractsByChain)) {
	// 		try {
	// 		  console.log(`Preparing multicall for chain ${chainId}`);
	// 		  const poolData = await multicall(wagmiConfig, {
	// 			contracts,
	// 			chainId: Number(chainId) as 137 | 42161,
	// 			allowFailure: false,
	// 		  });
	  
	// 		  console.log(`Pool data for chain ${chainId}:`, poolData);
	// 		  // Process poolData here if needed
	// 		} catch (error) {
	// 		  console.error(`Error fetching pool data for chain ${chainId}:`, error);
	// 		}
	// 	  }
	// 	};
	  
	// 	fetchPoolData();
	//   }, []); // Add any dependencies if needed

	type donorTokenBalance = {
		poolParams: Pool;
		balance: bigint;
	};

	// Target logic:
	// 1. Get all the campaigns that the user has donated to from the subgraph
	// 2. For the campaigns, check the user's donor token balances
	// 3. Show campaigns where donor Token balances > 0

	// useEffect(() => {
	// 	if (
	// 	//   chainId === chainConfig.chainId &&
	// 	  activeAddress != null &&
	// 	  !isOpen
	// 	) {
			
	
	// 		// Loop through each campaign in `campaign.json`, fetch the corresponding data and update the state variables.
	// 		const fetchCampaignDataFromDIVASmartContract = async () => {
	// 			// Variable used as a flag to display "Explore campaigns" message if user didn't make any donations
	// 			// yet or has already re-claimed the funds from previous campaigns.
	// 			let countCampaignsParticipated = 0

	// 			// Iterate through each campaign
	// 			for (const campaign of campaigns) {
	// 				// Get all pool IDs associated with this campaign
	// 				const campaignPoolIds = campaign.pools.map(pool => pool.poolId);

	// 				const decimals = Number(campaign.decimals)
			
	// 				// Connect to corresponding contract. Note that the first campaign was using a pre-audited
	// 				// version of the DIVA Protocol contract on Polygon. All subsequent campaigns are using the audited final version.
	// 				const divaContract = {
	// 					address: campaign.divaContractAddress as `0x${string}`,
	// 					abi: campaign.divaContractAddress === divaContractAddressOld
	// 						? DivaABIold
	// 						: DivaABI,
	// 					chainId: Number(campaign.chainId) as 137 | 42161
	// 				} as const
			
	// 				try {
	// 					// Get pool parameters for each pool associated with the campaign
	// 					const poolData = await Promise.all(
	// 						campaign.pools.map((pool: CampaignPool) =>
	// 							readContract(wagmiConfig, {
	// 								...divaContract,
	// 								functionName: 'getPoolParameters',
	// 								args: [pool.poolId]
	// 							})
	// 						)
	// 					)
			
	// 					// Get user's donor token in the campaign. If multiple pools are associated with the campaign,
	// 					// it returns an array of balances.
	// 					// @todo Use multicall here as it's on the same chain
	// 					const donorTokenBalance = await Promise.all(
	// 						// async needed inside map?
	// 						campaignPoolIds.map(async (poolId, index) => {
	// 							// const donorPositionToken =
	// 							// 	campaign.pools[0].beneficiarySide === 'short'
	// 							// 		? pool.longToken
	// 							// 		: pool.shortToken
				
	// 							const balance = await readContract(wagmiConfig, {
	// 								address: campaign.pools[index].donorToken as `0x${string}`,
	// 								abi: ERC20ABI,
	// 								functionName: 'balanceOf',
	// 								args: [activeAddress],
	// 							}) as bigint
				
	// 							return {
	// 								// poolParams: pool,
	// 								balance: balance,
	// 							} // @todo Do we need to return donorPositionToken like we did in the handleRedeemPositionToken function?
	// 						})
	// 					)
			
	// 					// Sum up the balances within the donorTokenBalance array.
	// 					const sumTokenBalanceFormatted = Number(
	// 						formatUnits(
	// 							donorTokenBalance.reduce((acc, data) => acc + data, BigInt(0)),
	// 							decimals
	// 						)
	// 					)
						
	// 					// If the user has donated to the campaign, increment the counter.
	// 					if (sumTokenBalanceFormatted > 0) {
	// 						countCampaignsParticipated += 1
	// 					}
			
	// 					// @todo pull donated from subgraph for campaigns that the user has outstanding donations to.
	// 					let sumDonated
	// 					if (campaign.pools[0].beneficiarySide === 'short') {
	// 						sumDonated = donorTokenBalance.reduce(
	// 							(acc, data) => acc + BigInt(data.poolParams.payoutShort) * BigInt(data.balance),
	// 							BigInt(0)
	// 						)
	// 					} else {
	// 						sumDonated = donorTokenBalance.reduce(
	// 							(acc, data) => acc + BigInt(data.poolParams.payoutLong) * BigInt(data.balance),
	// 							BigInt(0)
	// 						)
	// 					}

	// 					const divisor = parseUnits('1', decimals)
			
	// 					const sumDonatedFormatted = Number(
	// 						formatUnits(sumDonated / divisor, decimals)
	// 					) // @todo Chekc if this is the correct way to format the sumDonated
						
						
			
	// 					const currentStatusFinalReferenceValue =
	// 						Number(donorTokenBalance[0].poolParams.statusFinalReferenceValue) as Status
			
	// 					const claimEnabled =
	// 						isConnected &&
	// 						currentStatusFinalReferenceValue === 3 &&
	// 						sumTokenBalanceFormatted * 0.997 - sumDonatedFormatted > 0
			
	// 						updateCampaignBalance(
	// 							campaign.campaignId,
	// 							sumTokenBalanceFormatted
	// 						)
	// 						updateDonated(campaign.campaignId, sumDonatedFormatted)
	// 						updatePercentageDonated(
	// 							campaign.campaignId,
	// 							(sumDonatedFormatted / sumTokenBalanceFormatted) * 100
	// 						)
	// 						updateClaimEnabled(campaign.campaignId, claimEnabled)
	// 					updateStatusFinalReferenceValue(
	// 						campaign.campaignId,
	// 						currentStatusFinalReferenceValue
	// 					)
	// 				} catch (error) {
	// 					console.error(`Error fetching data for campaign ${campaign.campaignId}:`, error)
	// 				}
	// 			}
		
	// 			setCampaignsParticipated(countCampaignsParticipated)
	// 		}
		
	// 		fetchCampaignDataFromDIVASmartContract()
	// 		}
	//   }, [chainId, activeAddress, isOpen, isConnected])

	if (isLoading) return <div>Loading campaign data...</div>
	if (isError) return <div>Error loading campaign data</div>
  






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
			{(campaignsParticipated === 0 && !isOpen) && (
				<div className="pb-[23rem] flex flex-col items-center justify-center">
					<p className="mt-[60px]">{`There are no outstanding donations`}</p>
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
				{campaigns.map((campaign: Campaign) => {
					const expiryTimestamp = Number(campaign.expiryTimestamp)*1000
					if (donationStats[campaign.campaignId]?.campaignBalance > 0) {
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
												value={donationStats[campaign.campaignId]?.percentageDonated}>
												<ProgressLabel className="text-2xl flex flex-start">
													<Text fontSize="xs" marginLeft="0.5rem">
														{donationStats[campaign.campaignId]?.percentageDonated?.toFixed(1)}
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
															Deposited
														</dt>
														<dd className="font-normal text-base text-[#042940] ">
															$
															{donationStats[campaign.campaignId]?.campaignBalance &&
															!isNaN(donationStats[campaign.campaignId]?.campaignBalance)
																? Number(
																		donationStats[campaign.campaignId]?.campaignBalance
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
															{donationStats[campaign.campaignId]?.donated && !isNaN(donationStats[campaign.campaignId]?.donated)
																? Number(donationStats[campaign.campaignId]?.donated).toFixed(
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
																onClick={() => handleSwitchNetwork(chainConfig.chainId)}>
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
														className="p-2 text-blue-6000"
														onClick={connectWallet}>
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
											disabled={!donationStats[campaign.campaignId]?.claimEnabled}
											onClick={() => handleRedeemPositionToken(campaign)}
											type="button"
											className="disabled:hover:bg-[#042940] disabled:opacity-25 text-white bg-[#042940] hover:bg-blue-700 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
											{isExpired(expiryTimestamp) &&
											donationStats[campaign.campaignId]?.statusFinalReferenceValue !== 3
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
