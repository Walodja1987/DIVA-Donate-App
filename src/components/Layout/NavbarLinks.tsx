import React from 'react'
import Link from 'next/link'
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
} from '@chakra-ui/react'

import campaigns from '../../../config/campaigns.json'
import { links } from './../../constants'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'

export const NavbarLinks = () => {
	return (
		<ul className="items-center justify-center flex space-x-6 space-y-0">
			{links.map((link) => (
				<li key={link.name}>
					{link.name === 'Campaigns' ? (
						<Menu>
							{({ isOpen }) => (
								<>
									<MenuButton
										as={Button}
										rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
										className={
											'font-semibold text-dark-grey-100 hover:text-[#9FC131] hover:bg-transparent'
										}
										sx={{
											_active: {
												bg: 'transparent',
											},
										}}>
										{link.name}
									</MenuButton>
									<MenuList>
										{campaigns.map((campaign) => (
											<MenuItem
												key={campaign.campaignId}
												className="text-center">
												<Link
													href={campaign.path}
													className={
														'block px-4 py-2 text-base font-semibold hover:text-[#9FC131]'
													}>
													{campaign.title}
												</Link>
											</MenuItem>
										))}
									</MenuList>
								</>
							)}
						</Menu>
					) : (
						<Link
							href={link.to}
							target={link.target}
							rel={link.rel}
							className={
								'block py-2 pl-3 pr-4 text-base font-semibold hover:text-[#9FC131]'
							}>
							{link.name}
						</Link>
					)}
				</li>
			))}
		</ul>
	)
}
