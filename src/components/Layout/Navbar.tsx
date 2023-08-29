import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RxHamburgerMenu } from 'react-icons/rx'

import { NavbarLinks } from './NavbarLinks'
import { Logo } from '../Logo'
import { Sidebar } from './Sidebar'
import { useDisclosure } from '@chakra-ui/react'

export default function NavBar() {
	const [navbar, setNavbar] = useState(false)
	const { pathname } = useRouter()
	const { isOpen, onOpen, onClose } = useDisclosure()

	return (
		<>
			<Sidebar isOpen={isOpen} onClose={onClose} />
			<nav className="px-2 md:px-6 sm:px-4 py-6 md:w-full bg-[#F3FDF8] border-b-2 border-[#D6D58E] fixed top-0 left-0 right-0 z-10">
				<div className="mx-auto lg:max-w-screen-2xl flex items-center md:px-0 justify-between">
					<div className="flex gap-2 max-w-fit items-center outline-none py-2 md:py-0 md:block">
						<button
							className=" rounded-md text-gray-700 outline-none lg:hidden md:p-3 hover:bg-slate-200"
							onClick={onOpen}>
							{<RxHamburgerMenu size={20} />}
						</button>

						<Link href="/" className="w-36 md:w-72">
							<Logo />
						</Link>
					</div>

					<div
						className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 hidden lg:block`}>
						<NavbarLinks activePath={pathname} />
						<div className="mt-3 space-y-2 lg:hidden md:inline-block">
							<ConnectButton accountStatus="address" chainStatus="icon" />
						</div>
					</div>

					<div className="md:hidden lg:inline-block">
						<ConnectButton accountStatus="address" chainStatus="icon" />
					</div>
				</div>
			</nav>
		</>
	)
}
