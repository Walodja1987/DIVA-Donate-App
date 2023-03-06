import { AvatarComponent } from '@rainbow-me/rainbowkit'
import React from 'react'

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	return (
		<img
			src={'/favicon.svg'}
			width={size}
			height={size}
			style={{ borderRadius: 999 }}
		/>
	)
}
export default CustomAvatar
