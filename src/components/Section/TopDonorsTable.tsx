import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { formatUnits } from 'ethers/lib/utils';
import request, { gql } from 'graphql-request'
import { chainConfig } from '../../constants'
import { getShortenedAddress, ZERO } from '../../utils/general'
import { BigNumber } from 'ethers';
import { Campaign } from '../../types/campaignTypes'

export const queryDIVALiquidity = (poolId: string) => gql`
	{
		liquidities(where: {pool: "${poolId}"}) {
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

// Assume fetchTopDonors is a function that fetches the top donors from the subgraph
const fetchTopDonors = async (page, perPage) => {
  // Replace this with the actual query logic to fetch data from your subgraph
  const response = await fetch(`/api/top-donors?page=${page}&perPage=${perPage}`);
  return response.json();
};

export const TopDonorsTable: React.FC<{campaign: Campaign}> = ({campaign}) => {
//   const [page, setPage] = useState(1);
//   const perPage = 10;

const poolId = '0xcd3a8a1679580797dd0288ed0a5cf4b7cbc832392355365234eae85897411df0' // @todo add handling of multiple pools within a campaign

const decimals = campaign.decimals
console.log(poolId)
const {
    data,
    isLoading,
    isError
} = useQuery<any[]>(['liquidity'], async () => {
    const response = request(
        chainConfig.graphUrl,
        queryDIVALiquidity(poolId) // @todo pool?.id ?? ''
    ).then((data: any) => {
        if (data.liquidities != null) {
            return data.liquidities
        } else {
            console.log('No liquidity events found')
            return {}
        }
    })
    return response
})

if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error loading data</div>;

// Sum contributed amount by msgSender.
const sumByMsgSender = data.reduce((acc, item) => {
  if (item.eventType === 'Added' || item.eventType === 'Issued') {
    if (!acc[item.msgSender]) {
      acc[item.msgSender] = BigNumber.from(0);
    }
    acc[item.msgSender] = acc[item.msgSender].add(item.collateralAmount);
  }
  return acc;
}, {});

// Convert sumByMsgSender object into an array in order to be able to use map function for rendering.
// Each item in the array is an object with msgSender and collateralAmount properties.
const summedData = Object.entries(sumByMsgSender)
  .map(([msgSender, collateralAmount]) => ({
    msgSender,
    collateralAmount: BigNumber.from(collateralAmount), // Cast to BigNumber
  }))
  .sort((a, b) => b.collateralAmount.sub(a.collateralAmount).toNumber());


  
//   const { data, isLoading, error } = useQuery(['topDonors', page], () => fetchTopDonors(page, perPage), {
//     keepPreviousData: true,
//   });



//   const totalAmount = data.reduce((total, donor) => total + donor.amount, 0);

const totalAmount = summedData.reduce((total, donor) => total + Number(formatUnits(donor.collateralAmount, decimals)), 0).toFixed(0);

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
            <tr className="text-sm">
              <th></th> {/* Empty header for the numbering column */}
              <th className="text-left font-normal">Address</th>
              {/* <th>Date</th> */}
              <th className="text-left font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {summedData.map((donor, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-green-100' : 'bg-white'}>
                <td className="pl-10 rounded-l-lg">
                  <span className="inline-block bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {index + 1}
                  </span>
                </td> {/* Row number */}
                <td className="text-left w-40">{getShortenedAddress(donor.msgSender)}</td>
                {/* <td>{new Date(parseInt(donor.timestamp) * 1000).toLocaleDateString()}</td> */}
                <td className="text-left font-bold text-lg w-36 rounded-r-lg">${Number(formatUnits(donor.collateralAmount, decimals)).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="text-xl bg-green-100">
              <td></td>
              <td colSpan={1} className="text-left">Total:</td>
              <td className="font-bold text-left">${totalAmount}</td>
            </tr>
          </tfoot>
        </table>
        {/* <button onClick={() => setPage(page + 1)}>Show more</button> */}
      </div>
    </div>
  );
};