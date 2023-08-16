import { Contract, BigNumber } from "ethers";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { JsonRpcSigner, AlchemyProvider } from "@ethersproject/providers";

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// account is not optional
export function getSigner(
  library: AlchemyProvider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: AlchemyProvider,
  account?: string
): AlchemyProvider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(
  address: string,
  ABI: any,
  library: AlchemyProvider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

export async function getTokenBalance(contract: Contract, address: string) {
  if (contract !== null) {
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return {
      balance: balance,
      decimals: decimals,
    };
  }
}

export const valueFormatter = (num: number, decimalPlaces: number) =>
  Number(
    Math.round(Number(num + "e" + decimalPlaces)) + "e" + decimalPlaces * -1
  );

export const getShortenedAddress = (address: string) => {
  if (address != null) {
    const begin = address.slice(0, 6)
    const end = address.slice(address.length - 4)

    return `${begin}...${end}`
  } else return ''
}

export const formatDate = (timestampInMilliseconds: number): string => {
  return new Date(timestampInMilliseconds).toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }
  )
}

export const isExpired = (timestampInMilliseconds: number) => {
  if (!timestampInMilliseconds) {
    return false; // If there's no expiry time, it's not expired
  }
  
  const expiryTime = new Date(timestampInMilliseconds);
  const currentTime = new Date();
  
  return expiryTime < currentTime;
}