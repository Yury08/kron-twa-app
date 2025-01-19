'use client'

import dynamic from 'next/dynamic'
import { FC } from 'react'

import Home from './(home)/Home'
import { FarmingProvider } from '@/context/FarmingContext'

const newLocal = '@/components/nav/Navigation'

const Navigation = dynamic(() =>
	import('@/components/nav/Navigation').then(mod => mod.Navigation)
)

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
