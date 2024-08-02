import React, { useState } from 'react';
import { useQuery } from 'react-query';
import request, { gql } from 'graphql-request'
import { chainConfig } from '../../constants'

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

export const TopDonorsTable = () => {
//   const [page, setPage] = useState(1);
//   const perPage = 10;

const poolId = '0x8c85108a28a163d1722c2140eea57f9d1cb7f83f69dfc04eb0d9e51298dea2b6'
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

console.log("data", data)
  
//   const { data, isLoading, error } = useQuery(['topDonors', page], () => fetchTopDonors(page, perPage), {
//     keepPreviousData: true,
//   });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

//   const totalAmount = data.reduce((total, donor) => total + donor.amount, 0);

const totalAmount = 50;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((donor, index) => (
            <tr key={index}>
              <td>{donor.msgSender}</td>
              <td>{new Date(parseInt(donor.timestamp) * 1000).toLocaleDateString()}</td>
              <td>${parseFloat(donor.collateralAmount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total:</td>
            <td>${totalAmount.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
      {/* <button onClick={() => setPage(page + 1)}>Show more</button> */}
    </div>
  );
};