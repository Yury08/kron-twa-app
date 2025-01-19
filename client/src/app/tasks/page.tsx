import dynamic from 'next/dynamic'
import { FC } from 'react'

import Tasks from './Tasks'

const Navigation = dynamic(() =>
	import('@/components/nav/Navigation').then(mod => mod.Navigation)
)

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
