import Link from 'next/link'
import React from 'react'
import Button from '@/components/Button'
import { RxHamburgerMenu } from 'react-icons/rx'

import { NavbarLinks } from './NavbarLinks'
import { Logo } from '../Logo'
import { Sidebar } from './Sidebar'
import { useDisclosure } from '@chakra-ui/react'

import { useAccount } from 'wagmi'; // @todo: Question why it's imported directly and not via privy-io/wagmi

import { usePrivy } from '@privy-io/react-auth';

import { getShortenedAddress } from '@/utils/general'


export default function NavBar() {
	const { isOpen, onOpen, onClose } = useDisclosure()

	// Privy hooks
	const {ready, connectWallet} = usePrivy();
  
	// WAGMI hooks
	const {address: activeAddress, isConnected} = useAccount();
  
	if (!ready) {
	  return null;
	}

	return (
		<>
			<Sidebar isOpen={isOpen} onClose={onClose} />
			<nav className="px-4 md:px-6 sm:px-4 w-full bg-[#F3FDF8] border-b-2 border-[#D6D58E] fixed top-0 left-0 z-20">
				<div className="mx-auto lg:max-w-screen-2xl flex items-center justify-between">
					<div className="flex gap-2 max-w-fit items-center outline-none py-3 xl:py-[23px] xl:block">
						<button
							className="rounded-md text-gray-700 outline-none xl:hidden md:p-3 hover:bg-slate-200 w-6 md:w-14"
							onClick={onOpen}>
							{<RxHamburgerMenu size={'auto'} />}
						</button>

						<Link href="/" className="w-36 md:w-52 lg:w-72">
							<Logo />
						</Link>
					</div>

					<div
						className={`flex-1 justify-self-center pb-3 mt-8 md:pb-0 md:mt-0 hidden xl:block`}>
						<NavbarLinks/>
					</div>

					{isConnected && activeAddress ? (
						// Note: Injected wallets can't be programmatically disconnected.
						// Privy doesn't support wagmi's useDisconnect hook.
						// Use connectWallet to prompt for a different wallet instead.
						// Read more about it here: https://docs.privy.io/guide/react/wallets/usage/wagmi#using-wagmi-hooks
						<Button onClick_={connectWallet} cta={getShortenedAddress(activeAddress)} />
               		) : (
						<Button onClick_={connectWallet} cta="Connect" />
               		)}
				</div>
			</nav>
		</>
	)
}
