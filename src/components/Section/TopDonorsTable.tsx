import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { formatUnits } from 'ethers/lib/utils';
import request, { gql } from 'graphql-request'
import { chainConfig } from '../../constants'
import { getShortenedAddress } from '../../utils/general'
import { BigNumber } from 'ethers';
import { Campaign } from '../../types/campaignTypes'

// GraphQL query to fetch liquidity events for multiple pool IDs
export const queryDIVALiquidity = (poolIds: string[]) => gql`
  {
    liquidities(where: {pool_in: [${poolIds.map(id => `"${id}"`).join(', ')}]}) {
      pool {
        id
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

// TopDonorsTable component to display top donors for a campaign
export const TopDonorsTable: React.FC<{campaign: Campaign}> = ({campaign}) => {
  const [page, setPage] = useState(1); // State to manage pagination
  const perPage = 10; // Number of items per page

  const poolIds = campaign.pools.map(pool => pool.poolId); // Extract pool IDs from the campaign
  const decimals = campaign.decimals; // Get the decimals for formatting amounts

  // Fetch liquidity data using react-query
  const {
      data,
      isLoading,
      isError
  } = useQuery<any[]>(['liquidity', poolIds], async () => {
      const response = request(
          chainConfig.graphUrl,
          queryDIVALiquidity(poolIds)
      ).then((data: any) => {
          if (data.liquidities != null) {
              return data.liquidities;
          } else {
              console.log('No liquidity events found');
              return [];
          }
      });
      return response;
  });

  // Display loading or error messages
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  // Sum contributed amount by msgSender
  const sumByMsgSender = data.reduce((acc, item) => {
    if (item.eventType === 'Added' || item.eventType === 'Issued') {
      if (!acc[item.msgSender]) {
        acc[item.msgSender] = BigNumber.from(0);
      }
      acc[item.msgSender] = acc[item.msgSender].add(item.collateralAmount);
    }
    return acc;
  }, {});

  // Convert sumByMsgSender object into an array for rendering
  const summedData = Object.entries(sumByMsgSender)
    .map(([msgSender, collateralAmount]) => ({
      msgSender,
      collateralAmount: BigNumber.from(collateralAmount), // Cast to BigNumber
    }))
    .sort((a, b) => b.collateralAmount.sub(a.collateralAmount).toNumber()); // Sort by amount

  // Calculate total amount contributed
  const totalAmount = summedData.reduce((total, donor) => total + Number(formatUnits(donor.collateralAmount, decimals)), 0).toFixed(0);

  // Calculate the items to display based on the current page
  const displayedData = summedData.slice(0, page * perPage);

  return (
    <div className="container justify-center mx-auto mt-10">
      <div className="mx-auto max-w-7xl py-4 px-4 sm:px-6 text-center lg:items-center lg:justify-between">
        <h1 className="font-semibold text-4xl sm:text-6xl md:text-6l lg:text-6xl xl:text-6xl leading-[4.75rem] text-[#042940]">
          Top Donors
        </h1>
        <hr className="w-[9rem] h-[8px] mx-auto bg-[#9FC131] border-0 rounded-[20px] my-2" />
      </div>

      <div className="flex justify-center">
        <table>
          <thead>
            <tr className="text-sm h-10">
              <th></th> {/* Empty header for the numbering column */}
              <th className="text-left font-normal">Address</th>
              <th className="text-left font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((donor, index) => (
              <tr key={index} className={`h-12 ${index % 2 === 0 ? 'bg-[#DEEFE7]' : 'bg-white'}`}>
                <td className="pl-10 pr-2 rounded-l-lg">
                  <span className="inline-block bg-[#005C53] text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {index + 1}
                  </span>
                </td> {/* Row number */}
                <td className="text-left w-52 text-[#005C53]">
                  <a href={`${chainConfig.blockExplorer}/address/${donor.msgSender}`} target="_blank" rel="noopener noreferrer">
                    {getShortenedAddress(donor.msgSender)}
                  </a>  
                </td>
                {/* <td>{new Date(parseInt(donor.timestamp) * 1000).toLocaleDateString()}</td> */}
                <td className="text-left font-bold text-lg w-36 rounded-r-lg text-[#005C53]">${new Intl.NumberFormat('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(formatUnits(donor.collateralAmount, decimals)))}</td>
              </tr>
            ))}
            <tr className="h-2"></tr> {/* Empty row for spacing as margin attribute doesn't seem to work */}
          </tbody>
          <tfoot>
            <tr className="text-xl bg-[#DEEFE7] h-14">
              <td className="rounded-l-lg"></td>
              <td colSpan={1} className="text-left font-bold text-[#005C53]">Total:</td>
              <td className="font-bold text-left rounded-r-lg text-[#005C53]">${new Intl.NumberFormat('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(totalAmount))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex justify-center mt-4 space-x-4 pt-4 pb-10">
        {page > 1 && (
          <button
            className="text-[#042940] ring-1 ring-[#042940] px-4 py-2 rounded"
            onClick={() => setPage(page - 1)}
          >
            Show Less
          </button>
        )}
        {displayedData.length < summedData.length && (
          <button
            className="bg-[#042940] text-white px-4 py-2 rounded"
            onClick={() => setPage(page + 1)}
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};