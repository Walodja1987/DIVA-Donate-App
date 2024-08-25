'use client'

// Nextjs
import Image from 'next/image'
import Link from 'next/link'

// React
import React, { useEffect, useState, useCallback } from 'react'

// Query
import { useQueries } from '@tanstack/react-query';
import request from 'graphql-request'

// ABIs
import { DivaABI, DivaABIold, ERC20ABI } from '@/abi'

// Privy
import { usePrivy, useWallets } from '@privy-io/react-auth';

// viem
import { formatUnits } from 'viem'

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
	Text,
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
	type ReadContractReturnType,
} from '@wagmi/core'

// Subgraph queries
import { queryDIVALiquidity } from '@/queries/divaSubgraph'

// The Donations component renders the My Donations section of the app.
// It displays and manages user's active donations across various campaigns and chains.
//
// Data fetching and processing:
// Step 1: Fetch donor token balances defined in `campaigns.json`
// Step 2: Extract poolIds where donor token balance is greater than 0 (active pools)
// Step 3: Query liquidity event data from the DIVA subgraph for active pools
// Step 4: Process subgraph data by filtering all events where the donation recipient address is the expected one
// Step 5: Calculate donation stats
// Step 6: Update UI with the relevant campaigns and stats
export default function Donations() {
	const [donationStats, setDonationStats] = useState<{
		[campaignId: string]: {
		  campaignBalance: number,
		  donated: number,
		  percentageDonated: number,
		  claimEnabled: boolean,
		  status: CampaignStatus
		}
	}>({})
	  
	const [campaignsParticipated, setCampaignsParticipated] = useState(0)
	const [activePoolIdsByChain, setActivePoolIdsByChain] = useState<{ [chainId: number]: `0x${string}`[] }>({});
	
	// RedeemLoading state defined by campaign so that the loading wheel only appears for the campaign that is being redeemed
	const [redeemLoading, setRedeemLoading] = useState<{
	[campaignId: string]: boolean
	}>({})

	// Privy hooks
	const { connectWallet } = usePrivy();
	const { wallets} = useWallets();
	const wallet = wallets[0] // active/connected wallet

	// Wagmi hooks
	const { address: activeAddress, isConnected, chain, chainId } = useAccount()

	// Chakra hooks
	const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })

	// // Get the name of the campaign chain to display in the switch wallet message inside the DonationCard component
	// const chains = getChains(wagmiConfig)
	// const campaignChainId = Number(campaign.chainId)
	// const campaignChainName = chains.find((chain) => chain.id === campaignChainId)?.name
	
	// // Group pool IDs by chain ID. Using the `reduce` method on the campaigns array to iterate
	// // over all campaigns and accumulate a result.
	// // Example output:
	// // {
	// // 	"137": ["0x12...9ab", "0x45...567"],
	// // 	"42161": ["0xde...234"]
	// // }

	// 	// Create a query for each chain. Using useQueries hook to perform multiple queries in parallel
	// 	// in case there are multiple chains.
	// 	// The result, chainQueries, is an array of query results, one for each chain.
	// 	// Each query result object contains properties like data, isLoading, isError, etc., which we can use to handle the state of each query.
	//   const chainQueries = useQueries({
	// 	// Iterate over each chain and its pool IDs, creating a query configuration for each chain.
	// 	// Object.entries returns an array of key-value pairs, where each pair is a chain ID and its corresponding pool IDs array.
	// 	// Example:
	// 	// [
	// 	// 	[137, ["0x12...9ab", "0x45...567"]],
	// 	// 	[42161, ["0xde...234"]]
	// 	// ]
	// 	queries: Object.entries(poolIdsByChain).map(([chainId, poolIds]) => ({
	// 	  		// Set unique identifier for the query.
	// 		queryKey: ['divaLiquidityData', chainId, poolIds, activeAddress],
	// 	  	  // Define the query function that fetches the data for the given chain and pool IDs.
	// 		queryFn: async () => {
	// 		const response = await request<DIVALiquidityResponse>(
	// 		  chainConfigs[chainId].graphUrl,
	// 		  queryDIVALiquidity(poolIds, activeAddress)
	// 		)
	// 		return response.liquidities || []
	// 	  },
	// 	  enabled: !!activeAddress
	// 	}))
	//   })

	  // Check if any of the queries are still loading or if there was an error.
	// const isLoading = chainQueries?.some(query => query.isLoading)
	// const isError = chainQueries?.some(query => query.isError)

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

	// Return type from fetchDonorTokenBalances
	type TokenInfoWithBalance = TokenInfo & {
		donorTokenBalance: bigint;
	};

	  // Step 1: Fetch donor token balances	  
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
		} as const));

		try {
			const results = await readContracts(wagmiConfig, {
			  contracts: allContracts,
			  allowFailure: false,
			});
			
			// Return tokenInfos with the balance added
			return tokenInfos.map((info, index) => ({
			  ...info,
			  donorTokenBalance: results[index] as bigint
			}));
		
		  } catch (error) {
			console.error("Error fetching balances:", error);
			// Set balances to 0 for all tokens if there was an error
			return tokenInfos.map(info => ({
			  ...info,
			  donorTokenBalance: BigInt(0)
			}));
		  }			
	  };
	
	// Update the filter condition in the useMemo hook.
	// Active means that the user's donor token balance is greater than 0.
	const getActivePoolIdsByChain = useCallback((balances: TokenInfoWithBalance[]) => {
	return balances
		.filter(info => info.donorTokenBalance > BigInt(0))
		.reduce((acc, info) => {
		if (!acc[info.chainId]) acc[info.chainId] = [];
		acc[info.chainId].push(info.poolId);
		return acc;
		}, {} as { [chainId: number]: `0x${string}`[] });
	}, []);

	
	// Steps 1 & 2: Fetch user's donor token balances and extract the active poolIds by chain.
	// Active pools are those where the user has a non-zero balance of donor tokens,
	// indicating an outstanding contribution or unclaimed funds.
	// Triggers on component mount and when activeAddress changes.
	useEffect(() => {
		(async () => {
		  if (activeAddress) {
			const balances = await fetchDonorTokenBalances(activeAddress);	  
			const newActivePoolIdsByChain = getActivePoolIdsByChain(balances);
			setActivePoolIdsByChain(newActivePoolIdsByChain);
		  } else {
			console.log("No active address, skipping balance fetch");
		  }
		})();
	  }, [activeAddress]);

	// Step 3: Query subgraph data.
	// Uses useQueries hook to perform parallel queries for each chain with active pools.
	// Each query runs only if activeAddress exists and there are active pool IDs for that chain.
	// Each item in the query results array contains data, isLoading, isError, and isSuccess properties.
	// If activePoolIdsByChain is empty or undefined, Object.entries(activePoolIdsByChain) will produce an empty array, so no queries will be created.
	// Queries are enabled only when an active address exists and the chain has active pool IDs.
	const subgraphQueries = useQueries({
		// Iterate over each chain and its pool IDs, creating a query configuration for each chain.
		// Object.entries returns an array of key-value pairs, where each pair is a chain ID and its corresponding pool IDs array.
		// Example:
		// [
		// 	[137, ["0x12...9ab", "0x45...567"]],
		// 	[42161, ["0xde...234"]]
		// ]
		queries: Object.entries(activePoolIdsByChain).map(([chainId, poolIds]) => ({
			// Query key is an array containing the query name, chainId, poolIds, and activeAddress.
			// This is used to identify the query and to invalidate it when any of the array variables change.
			queryKey: ['divaLiquidityData', chainId, poolIds, activeAddress],
			// Query function to fetch data from the subgraph.
			queryFn: async () => {
				const response = await request<DIVALiquidityResponse>(
					chainConfigs[chainId].graphUrl,
					queryDIVALiquidity(poolIds, activeAddress)
				);
				// console.log(`Response for chain ${chainId}:`, response);
				return response.liquidities || [];
			},
			// Query is enabled only when an active address exists and the chain has active pool IDs.
			enabled: !!activeAddress && poolIds.length > 0
			})
		)
  	});

	// Check loading, error and isSuccess states of the subgraph queries
	const isLoading = subgraphQueries?.some(query => query.isLoading);
	const isError = subgraphQueries?.some(query => query.isError);
	const isSuccess = subgraphQueries?.every(query => query.isSuccess);

	useEffect(() => {
		// Process the campaign data from the subgraph where the user still owns the corresponding donor tokens ("active campaigns")
		// const allQueriesSuccessful = subgraphQueries.every(query => query.isSuccess);
		
		if (isSuccess) {
			// Put the data from the query results into a single array (originally separated by chainId)
			// Example of an item in flattenedData array:
			// {
			// 	id: "0x123...abc-0",
			// 	eventType: "Added",
			// 	collateralAmount: "1000000000000000000",
			// 	msgSender: "0xuser1...",
			// 	shortTokenHolder: "0xuser2...",
			// 	longTokenHolder: "0xuser3...",
			// 	timestamp: "1678901234",
			// 	pool: {
			// 	  id: "0x123...abc",
			// 	  statusFinalReferenceValue: "Open",
			// 	  capacity: "10000000000000000000",
			// 	  collateralBalanceGross: "5000000000000000000",
			// 	  payoutLong: "1500000000000000000",
			// 	  payoutShort: "500000000000000000",
			// 	}
			// }
			const flattenedData = subgraphQueries
				.filter(query => query.isSuccess && query.data)
				.flatMap(query => query.data);

				// Transform campaign data into a map from poolId to campaignId, beneficiarySide and donationRecipientAddress
			// to be added to the (flattened) subgraph data. This will be used to filter out all events where shortTokenHolder or longTokenHolder didn't equal
			// the expected donation recipient.
			const poolDetails = campaigns.reduce((acc, campaign) => {
				campaign.pools.forEach(pool => {
				acc[pool.poolId] = {
					campaignId: campaign.campaignId,
					beneficiarySide: pool.beneficiarySide,
					donationRecipientAddress: campaign.donationRecipients[0].address,
					decimals: Number(campaign.decimals),
					chainId: Number(campaign.chainId) as 137 | 42161
				};
				});
				return acc;
			}, {} as Record<string, { campaignId: string, beneficiarySide: string, donationRecipientAddress: string, decimals: number, chainId: 137 | 42161 }>);
		  
			// Add campaignId to each element in flattenedData.
			// Example of an item in dataWithCampaignId array:
			// {
			//   beneficiarySide: "short",
			//   campaignId: "test_ongoing_dUSD_polygon",
			//   collateralAmount: "1000000000000000000",
			//   donationRecipientAddress: "0x9adefeb576dcf52f5220709c1b267d89d5208d78",
			//   decimals: 18,
			//   eventType: "Added",
			//   id: "0x3ed05b4c5a4509b15bf6ea9e529fce74d5d6bd5ecbaa839ef83a1a30e2edcdb0-0x4452a2a37d4dbe1227aecce97b93d6b4",
			//   longTokenHolder: "0x9adefeb576dcf52f5220709c1b267d89d5208d78",
			//   msgSender: "0x9adefeb576dcf52f5220709c1b267d89d5208d78",
			//   pool: {
			//     id: "0x3ed05b4c5a4509b15bf6ea9e529fce74d5d6bd5ecbaa839ef83a1a30e2edcdb0",
			//     statusFinalReferenceValue: "Open",
			//     capacity: "1000000000000000000",
			//     collateralBalanceGross: "1000000000000000000",
			//     payoutLong: "1000000000000000000",
			//     payoutShort: "1000000000000000000",
			//     expiryTime: "10001723986393",
			//   },
			//   shortTokenHolder: "0x47566c6c8f70e4f16aa3e7d8eed4a2bdb3f4925b",
			//   timestamp: "1724276061"
			// }
			// @todo: poolId is currently stored twice in id and pool.id. Check whether it's needed
			const enrichedData = flattenedData.map(item => ({
				...item,
				campaignId: poolDetails[item.pool.id].campaignId,
				beneficiarySide: poolDetails[item.pool.id].beneficiarySide,
				donationRecipientAddress: poolDetails[item.pool.id].donationRecipientAddress,
				decimals: poolDetails[item.pool.id].decimals,
				chainId: poolDetails[item.pool.id].chainId
			}));
		
			// Filter out all events where shortTokenHolder or longTokenHolder didn't equal the expected donation recipient.
			const filteredData = enrichedData.filter(item => 
				item.beneficiarySide === 'long' && item.longTokenHolder.toLowerCase() === item.donationRecipientAddress.toLowerCase() ||
				item.beneficiarySide === 'short' && item.shortTokenHolder.toLowerCase() === item.donationRecipientAddress.toLowerCase()
			); 

			// Determine the campaign status. Note that aLl pools associated with the campaign must be confirmed in order for the campaing to be considered confirmed.
			// Create a map to store the status of each campaign
			const campaignStatusMap: { [campaignId: string]: CampaignStatus } = {};

			// Get status for each campaign
			// @todo Use either forEach or reduce consistently, don't mix
			filteredData.forEach(item => {
				const campaign = campaigns.find(c => c.campaignId === item.campaignId);
				if (!campaign) return; // Shouldn't happen but just in case.

				const isExpiredCampaign = isExpired(Number(campaign.expiryTimestamp) * 1000); // Could have pulled it from filtereData directly, but would then need to handle multiple poolIds with potentially different expiry times.
				const poolStatus = item.pool.statusFinalReferenceValue as StatusSubgraph;

				let campaignStatus: CampaignStatus;
				if (isExpiredCampaign) {
					if (poolStatus === 'Confirmed') {
						campaignStatus = 'Completed';
					} else {
						campaignStatus = 'Expired';
					}
				} else {
					campaignStatus = 'Ongoing';
				}

				// Only update the campaignStatusMap if i) there is no status yet for this campaign, or ii) the current status in campaignStatusMap is 'Completed' but the new status is not 'Completed'.
				// This ensures that if any pool in a campaign is not 'Completed', the campaign status will reflect that, while still allowing a campaign to be marked as 'Completed' if all of its pools are confirmed.
				if (!campaignStatusMap[item.campaignId] || (campaignStatusMap[item.campaignId] === 'Completed' && campaignStatus !== 'Completed')) {
					campaignStatusMap[item.campaignId] = campaignStatus;
				}
			});

			// Calculate committed (contributed) for each campaign
			const committedByCampaign = filteredData.reduce((acc, item) => {
				// This line checks if an entry for the current campaign (identified by item.campaignId) already exists in the
				// accumulator (acc). If it doesn't exist, it initializes a new object for this campaign with a sumCommitted property set to BigInt(0).
				if (!acc[item.campaignId]) acc[item.campaignId] = 0;
				// Add collateralAmount to the sumCommitted property of the current campaign.
				acc[item.campaignId] += Number(formatUnits(BigInt(item.collateralAmount), item.decimals));
				return acc;
			}, {} as Record<string, number>);

			// Calculate donated (i.e. actually paid out to beneficiaries) for each campaign
			const donatedByCampaign = filteredData.reduce((acc, item) => {
				if (!acc[item.campaignId]) acc[item.campaignId] = 0;
				const amount = BigInt(item.collateralAmount)
				const payout = item.beneficiarySide === 'long' ? BigInt(item.pool.payoutLong) : BigInt(item.pool.payoutShort)
				acc[item.campaignId] += Number(formatUnits(amount * payout, item.decimals * 2)); // formatUnits is used here to divide the amount by 10^decimals due to integer multiplication and then a second time to convert it into a displayable number
				return acc;
			}, {} as Record<string, number>);

			// After processing committedByCampaign and donatedByCampaign
			const newDonationStats = Object.keys(committedByCampaign).reduce((acc, campaignId) => {
				const committed = committedByCampaign[campaignId];
				const donated = Number(donatedByCampaign[campaignId] || 0);
				acc[campaignId] = {
					campaignBalance: committed, // @todo consider renaming campaignBalance to committed
					donated: donated,
					percentageDonated: committed > 0 ? (donated / committed) * 100 : 0,
					// campaignBalance: 0, // @todo update
					claimEnabled: campaignStatusMap[campaignId] === 'Completed' && committed * 0.997 - donated > 0, // Enable Claim button if there is something to claim (i.e. committed * 0.997 - donated > 0 )
					status: campaignStatusMap[campaignId]
				};
				return acc;
			}, {} as typeof donationStats);
			setDonationStats(newDonationStats); 
		}

	  }, [isSuccess, activePoolIdsByChain]);

	  
	// @todo add countCampaignsParticipated logic -> maybe just see whether length is > 0?
	  

	// Updates the loading state for a specific campaign's redeem action.
	// It preserves the loading states of other campaigns while updating the specified one.
	const updateRedeemLoading = (campaignId: string, loading: boolean) => {
		setRedeemLoading((prev) => ({
			...prev,
			[campaignId]: loading,
		}))
	}

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
