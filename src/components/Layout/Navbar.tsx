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
			<nav className="px-4 md:px-6 sm:px-4 py-6 w-full bg-[#F3FDF8] border-b-2 border-[#D6D58E] fixed top-0 left-0 z-10">
				<div className="mx-auto lg:max-w-screen-2xl flex items-center md:px-0 justify-between">
					<div className="flex gap-2 max-w-fit items-center outline-none py-2 md:py-0 lg:block">
						<button
							className=" rounded-md text-gray-700 outline-none lg:hidden md:p-3 hover:bg-slate-200 w-6 md:w-14"
							onClick={onOpen}>
							{<RxHamburgerMenu size={'auto'} />}
						</button>

						<Link href="/" className="w-36 md:w-52 lg:w-72">
							<Logo />
						</Link>
					</div>

					<div
						className={`flex-1 justify-self-center pb-3 mt-8 md:pb-0 md:mt-0 hidden lg:block`}>
						<NavbarLinks activePath={pathname} />
					</div>

					<ConnectButton accountStatus="address" chainStatus="icon" />
				</div>
			</nav>
		</>
	)
}
