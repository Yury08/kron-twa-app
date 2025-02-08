import { FC } from 'react'

import { Navigation } from '@/components/nav/Navigation'

import Tasks from './Tasks'

const TasksPage: FC = () => {
	return (
		<div className='container'>
			<div className='container__inner'>
				<Tasks />
				<Navigation />
			</div>
		</div>
	)
}

export default TasksPage
