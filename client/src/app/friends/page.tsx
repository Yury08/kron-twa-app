import { FC } from 'react'

import { Navigation } from '@/components/nav/Navigation'

import Friends from './Friends'

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
