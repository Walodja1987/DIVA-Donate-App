import React from 'react'
import {
	Box,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
} from '@chakra-ui/react'
import { MinusIcon, AddIcon } from '@chakra-ui/icons'

const FAQItem = ({ title, body }: any) => (
	<AccordionItem
		// bgGradient={"linear(to-r, #303030 0%, #1B1B1B 100%)"}
		background={'#DEEFE7'}
		borderRadius="16px"
		border={'none'}
		px={5}
		py="2"
		my="10"
		w={['auto', 'auto', '50%', '60%', '60%']}
		mx="auto">
		{({ isExpanded }) => (
			<>
				<AccordionButton
					sx={{
						_active: {
							background: 'transparent',
						},
						_hover: {
							background: 'transparent',
						},
					}}>
					<Box
						flex="1"
						textAlign="left"
						fontWeight={['350', '350', '350', '700', '700']}
						fontSize={['22px', '22px', '30px', '30px', '30px']}
						color="#042940">
						{title}
					</Box>
					{isExpanded ? (
						<MinusIcon color="green" fontSize="12px" />
					) : (
						<AddIcon color="green" fontSize="12px" />
					)}
				</AccordionButton>
				<AccordionPanel
					fontSize={['18px', '18px', '24px', '24px', '24px']}
					color="#042940"
					textAlign="left">
					{body}
				</AccordionPanel>
			</>
		)}
	</AccordionItem>
)

export default FAQItem
