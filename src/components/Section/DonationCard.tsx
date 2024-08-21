import {
	Progress,
	ProgressLabel,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Spinner,
	Text,
} from '@chakra-ui/react'
import Link from 'next/link'

import {
	getShortenedAddress,
	formatNumberWithCommas,
} from '../../utils/general'
import { chainConfig } from '../../constants'

interface DonationCardProps {
	thankYouMessage: string
	isConnected: boolean
	connectedChainId: number
	campaignChainId: number
	campaignChainName: string
	isOpen: boolean
	onClose: () => void
	percentage: number
	goal: number | 'Unlimited'
	raised: number
	amount: string
	insufficientFunds: boolean
	handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	balance: number
	campaign: any
	approveLoading: boolean
	handleApprove: () => void
	toGo: number | 'Unlimited'
	approveEnabled: boolean
	donateLoading: boolean
	handleDonation: () => void
	donateEnabled: boolean
	openConnectModal: (() => void) | undefined
	handleSwitchNetwork: () => void
}

export const DonationCard: React.FC<DonationCardProps> = ({
	thankYouMessage,
	isConnected,
	connectedChainId,
	campaignChainId,
	campaignChainName,
	isOpen,
	onClose,
	percentage,
	goal,
	raised,
	amount,
	insufficientFunds,
	handleAmountChange,
	balance,
	campaign,
	approveLoading,
	handleApprove,
	toGo,
	approveEnabled,
	donateLoading,
	handleDonation,
	donateEnabled,
	openConnectModal,
	handleSwitchNetwork,
}) => {
	console.log("insufficientFunds", insufficientFunds)
	console.log("approveEnabled", approveEnabled)
	console.log("donateEnabled", donateEnabled)
	return (
		<div className="lg:h-[660px] justify-evenly px-4 py-8 lg:p-[60px] lg:w-[600px]">
			<div className="mb-10">
				<p className="mb-3 font-normal font-['Open_Sans'] text-base text-center text-[#042940]">
					{thankYouMessage}
				</p>
			</div>
			{isConnected && connectedChainId ? (
				<>
					{connectedChainId === campaignChainId ? (
						<>
							{/* {percentage !== 0 && (
							<div className="mb-10 w-full bg-[#D6D58E] rounded-[10px]">
							<div
								className="bg-[#005C53] text-xs font-medium text-blue-100 p-0.5 leading-none rounded-l-full"
								style={{width: percentage + '%'}}>
								<div className="m-auto flex">
									{percentage.toFixed(2)}%
								</div>
							</div>
						</div>
						)} */}
							{/* If you receive the error "TypeScript: Expression produces a union type that is too complex to represent.", then follow this advice: https://stackoverflow.com/questions/74847053/how-to-fix-expression-produces-a-union-type-that-is-too-complex-to-represent-t */}
							<ThanksDonationModal isOpen={isOpen} onClose={onClose} />
							<Progress
								className="mb-8 lg:mb-3 rounded-[15px]"
								style={{ background: '#D6D58E' }}
								colorScheme="green"
								height="22px"
								value={percentage}>
								<ProgressLabel className="text-2xl flex flex-start">
									<Text color={'white'} fontSize="xs" marginLeft="0.5rem">
										{percentage.toFixed(1)}%
									</Text>
								</ProgressLabel>
							</Progress>
							<div className="grid grid-cols-3 text-center divide-x-[1px] divide-[#005C53] mb-10 font-lora">
								<GoalComponent
									title="Goal"
									value={goal === 'Unlimited' ? 'Unlimited' : Number(goal)}
								/>
								<GoalComponent title="Raised" value={Number(raised)} />
								<GoalComponent
									title="To Go"
									value={goal === 'Unlimited' ? 'Unlimited' : Number(toGo)}
								/>
							</div>
							<div className="mb-3">
								<p className="font-semibold text-base lg:text-2xl font-['lora'] text-left text-[#042940]">
									Enter deposit amount
								</p>
							</div>

							<div>
								<form>
									<div className="flex">
										<div className="relative flex items-center w-full">
											<input
												id="search"
												value={amount}
												onChange={handleAmountChange}
												placeholder="Amount"
												className="h-[46px] w-full p-4 text-lg border border-[#042940]/24 focus:outline-none text-gray-900 rounded-[10px] bg-[rgba(4, 41, 64, 0.24)]"
											/>

											<button
												id="dropdownDefaultButton"
												data-dropdown-toggle="dropdown"
												className="disabled absolute right-0 top-0 bottom-0 text-white bg-[#005C53] focus:ring-green-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center flex gap-2 items-center font-openSans"
												type="button">
												<img src="/Images/usdt-logo.svg" alt="USDT" />

												<div className="text-base">USDT</div>
											</button>
											<div
												id="dropdown"
												className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
												<ul
													className="py-2 text-sm text-gray-700 dark:text-gray-200"
													aria-labelledby="dropdownDefaultButton">
													<li>
														<a
															href="#"
															className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
															USDT
														</a>
													</li>
													<li>
														<a
															href="#"
															className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
															ETH
														</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div className="mb-3">
								<p className="font-normal text-xs mt-2 lg:text-base font-openSans text-right text-[#042940]">
									Available balance:&nbsp;{balance.toFixed(2)}
								</p>
							</div>
							<div className="mt-4 mb-3 font-normal font-openSans text-sm lg:text-base text-[#042940] flex justify-between items-center">
								<span>Beneficiary address: </span>
								<Link
									target="_blank"
									href={campaign?.donationRecipients[0].url}
									className="font-normal font-['Open_Sans'] text-[#042940] flex items-center">
									{getShortenedAddress(campaign?.donationRecipients[0].address)}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-4 h-4 ml-2">
										<path
											fill-rule="evenodd"
											d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z"
											clip-rule="evenodd"
										/>
									</svg>
								</Link>
							</div>

							<div className="flex flex-row justify-between border-spacing-x-8 gap-4">
							<CustomButton
								isLoading={approveLoading || donateLoading}
								onClick={approveEnabled ? handleApprove : handleDonation}
								isEnabled={!insufficientFunds && (approveEnabled || donateEnabled)}
								label={
									insufficientFunds 
									? 'Insufficient Funds' 
									: (approveEnabled ? 'Approve' : (donateEnabled ? 'Deposit' : 'Enter amount'))
								}
							/>
							</div>
						</>
					) : (
						<UnsupportedNetworkModal
							handleSwitchNetwork={handleSwitchNetwork}
							campaignChainName={campaignChainName}
						/>
					)}
				</>
			) : (
				// <UnsupportedNetworkModal
				// 	openConnectModal={openConnectModal}
				// 	chainConfig={chainConfig}
				// />
				<ConnectWalletModal openConnectModal={openConnectModal} />
			)}
		</div>
	)
}

const ThanksDonationModal: React.FC<any> = ({ isOpen, onClose }) => (
	<Modal isCentered isOpen={isOpen} onClose={onClose}>
		<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
		<ModalContent>
			<ModalHeader>🙏 Thank you for your Deposit! </ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				Help us improve our product by participating in our{' '}
				<span className="font-semibold">survey</span>
			</ModalBody>

			<ModalFooter>
				<Button variant="ghost" mr={3} onClick={onClose}>
					No Thanks
				</Button>
				<Button
					className="text-white"
					sx={{
						backgroundColor: '#005C53',
						_hover: {
							backgroundColor: '#042940',
						},
					}}>
					<Link
						href="https://o26wxmqxfy2.typeform.com/to/LnNYG7Wy"
						target="_blank"
						rel="noopener noreferrer"
						className="text-white">
						Take Survey
					</Link>
				</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>
)

const GoalComponent: React.FC<{
	title: string
	value: number | 'Unlimited'
}> = ({ title, value }) => (
	<div className="flex flex-col items-center justify-center">
		<dt className="mb-2 font-medium text-xl text-[#042940]">{title}</dt>
		<dd className="font-normal text-base text-[#042940]">
			{value === 'Unlimited'
				? 'Unlimited'
				: '$' + formatNumberWithCommas(value.toFixed(0))}
		</dd>
	</div>
)

const CustomButton: React.FC<any> = ({
	isLoading,
	onClick,
	isEnabled,
	label,
  }) => {
	return (
	  <button
		onClick={onClick}
		className={`w-full disabled:opacity-25 flex justify-center items-center mt-10 py-3 text-lg text-white bg-[#042940] rounded-[10px] hover:bg-[#042940] focus:outline-none focus:ring-2 focus:ring-[#005C53] focus:ring-opacity-50 ${
		  isLoading ? 'relative' : ''
		}`}
		type="button"
		disabled={!isEnabled || isLoading}>
		{isLoading ? <Spinner /> : label}
	  </button>
	)
  }

const UnsupportedNetworkModal: React.FC<any> = ({
	handleSwitchNetwork,
	campaignChainName,
}) => (
	<div className="mb-10 flex flex-col items-center justify-center gap-6">
		<div>
			<img src="/Images/error-icon.svg" alt="error" />
		</div>
		<div className="text-xl font-lora text-[#042940]">This campaign is run on the {campaignChainName} network</div>
		<Button
			className="bg-blue-600 text-white rounded-xl"
			bg="blue.600"
			color="white"
			_hover={{ bg: 'blue.700' }}
			onClick={handleSwitchNetwork}>
			Switch to {campaignChainName}
		</Button>
	</div>
)

interface ConnectWalletModalProps {
	openConnectModal: (() => void) | undefined
  }
  
const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ openConnectModal }) => (
	<div className="mb-10 flex flex-col items-center justify-center gap-6">
	  <div>
		<img src="/Images/error-icon.svg" alt="wallet" />
	  </div>
	  <div className="text-xl font-lora text-[#042940]">Connect Your Wallet</div>
	  <p className="text-center text-[#042940]">
		Please connect your wallet to interact with this campaign.
	  </p>
	  <Button
		className="bg-blue-600 text-white rounded-xl"
		bg="blue.600"
		color="white"
		_hover={{ bg: 'blue.700' }}
		onClick={openConnectModal}
	  >
		Connect Wallet
	  </Button>
	</div>
)
