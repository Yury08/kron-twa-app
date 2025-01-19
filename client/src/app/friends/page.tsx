import dynamic from 'next/dynamic'
import { FC } from 'react'

import Friends from './Friends'

const Navigation = dynamic(() =>
	import('@/components/nav/Navigation').then(mod => mod.Navigation)
)

const FriendsPage: FC = () => {
	return (
		<div className='container'>
			<div className='container__inner'>
				<Friends />
				<Navigation />
			</div>
		</div>
	)
}

export default FriendsPage
