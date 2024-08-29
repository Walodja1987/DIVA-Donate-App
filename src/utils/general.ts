import { BigNumber, ethers } from "ethers";
import type { BigNumberish } from "ethers";

export const ZERO = BigNumber.from(0)

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
      // hour: '2-digit',
      // hour12: true,
      // timeZoneName: 'short',
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

export const isUnlimited = (amount: BigNumberish): boolean => {
  return BigNumber.from(amount).gte(ethers.constants.MaxUint256) // gte in case more than one pool is aggregated
}

export function formatNumberWithCommas(str: string): string {
  const numberValue = parseInt(str, 10);
  if (isNaN(numberValue)) {
    return str; // Return the original string if it's not a valid number
  }
  return new Intl.NumberFormat().format(numberValue);
}