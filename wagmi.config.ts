// Learn about the wagmi CLI here: https://wagmi.sh/cli/why
// In summary, it generates hooks based on ABIs, reducing
// code repetition when using the standard useWriteTransaction
// and useReadTransaction hooks.
import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins' // import React plugin to generate React hooks

import { DivaABI, DivaABIold, ERC20ABI } from '@/abi'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'diva',
      abi: DivaABI
    },
    {
      name: 'divaOld',
      abi: DivaABIold
    },
    {
      name: 'erc20',
      abi: ERC20ABI
    },
  ],
  plugins: [
    react()
  ],
})
