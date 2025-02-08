'use client'

import { FC } from 'react'

import { Navigation } from '@/components/nav/Navigation'

import Home from './(home)/Home'
import { FarmingProvider } from '@/context/FarmingContext'

const HomePage: FC = () => {
	return (
		<FarmingProvider>
			<div className='container'>
				<div className='container__inner'>
					<Home />
					<Navigation />
				</div>
			</div>
		</FarmingProvider>
	)
}

export default HomePage
