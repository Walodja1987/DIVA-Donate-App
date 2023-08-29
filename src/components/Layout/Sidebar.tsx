import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerBody,
	Stack,
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
} from '@chakra-ui/react'
import React, { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { links, NavItemType } from './../../constants'

const baseButtonClass =
	'items-start text-left justify-start w-full p-3 bg-[#F3FDF8] rounded-md hover:bg-[#E0F2E4] font-openSans'

export const Sidebar = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean
	onClose: () => void
}) => {
	const pathname = usePathname()

	return (
		<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton color={'#015c53'} />
				<div>
					<img src="/favicon.svg" alt="diva" className="w-12 mt-4 ml-6" />
				</div>

				<DrawerBody className="mt-6">
					<Stack>
						{links.map((link) =>
							link.isDropdown ? (
								<DropDownSidebarItem key={link.to} link={link} />
							) : (
								<SidebarItem
									key={link.to}
									link={link}
									active={pathname === link.to}
								/>
							)
						)}
					</Stack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	)
}

function DropDownSidebarItem({ link }: { link: NavItemType }) {
	return (
		<Accordion allowMultiple>
			<AccordionItem className="border-none font-openSans">
				<AccordionButton
					className="flex justify-between w-full bg-[#F3FDF8] rounded-md hover:bg-[#E0F2E4] font-openSans"
					sx={{
						_active: {
							bgColor: '#F3FDF8',
						},
						_hover: {
							bgColor: '#F3FDF8',
						},
						padding: '12px',
					}}>
					{link.name}
					<AccordionIcon />
				</AccordionButton>
				<AccordionPanel pb={2} pr={0}>
					<Stack>
						{link?.dropdownItems &&
							link.dropdownItems.map((campaign) => (
								<Link
									href={campaign.path}
									key={campaign.campaignId}
									className="w-full">
									<button className="items-start text-left justify-start w-full p-3 bg-[#F3FDF8] rounded-md hover:bg-[#E0F2E4] font-openSans">
										{campaign.title}
									</button>
								</Link>
							))}
					</Stack>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	)
}

function SidebarItem({ link, active }: { link: NavItemType; active: boolean }) {
	return (
		<Link href={link.to} key={link.to} className="w-full">
			<button
				onClick={() => {}}
				className={clsx(
					baseButtonClass,
					active
						? 'font-bold bg-[#9fc131] border border-[#015c53] text-[#015c53]'
						: ''
				)}>
				{link.name}
			</button>
		</Link>
	)
}
