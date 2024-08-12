// @todo Look slike I cannot simply use the abi from generated.ts but have to use the original ABI for the 
// wagmi action functions to work

import { DivaABI, DivaABIold } from '@/abi'
import { divaContractAddressOld } from '../../constants'

export const divaContract = {
    address: '0x0000000000000000000000000000000000000000',
    abi: DivaABI
} as const

export const divaOldContract = {
    address: '0x0000000000000000000000000000000000000000',
    abi: DivaABIold
} as const