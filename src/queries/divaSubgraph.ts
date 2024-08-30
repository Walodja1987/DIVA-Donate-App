// GraphQL queries to fetch liquidity events for multiple pool IDs.
import { gql } from 'graphql-request'

// Used in TopDonorsTable to query the top donors for each campaign.
// Accepts multiple poolIds as input.
export const queryDIVALiquidity = (poolIds: `0x${string}`[], msgSender?: string) => gql`
  {
    liquidities(where: {
      pool_in: [${poolIds.map(id => `"${id}"`).join(', ')}]
      ${msgSender ? `, msgSender: "${msgSender.toLowerCase()}"` : ''}
    }) {
      pool {
        id
        statusFinalReferenceValue
        payoutLong
        payoutShort
        capacity
        collateralBalanceGross
      }
      eventType
      collateralAmount
      id
      longTokenHolder
      shortTokenHolder
      msgSender
      timestamp
    }
  }
`

// Used in CampaignSection to query the Raised figure for each campaign.
// Accepts multiple poolIds as input.
export const queryDIVAPool = (poolIds: `0x${string}`[]) => gql`
  {
    pools(where: {id_in: [${poolIds.map(id => `"${id}"`).join(', ')}]}) {
      id
      collateralBalanceGross
      statusFinalReferenceValue
      longToken { id }
      shortToken { id }
      payoutLong
      payoutShort
    }
  }
`