'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'

import { ITask, TypeTask } from '@/types/task.types'

import { TASK_ICONS, TaskIconType } from '@/config/image-tasks-paths.config'
import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import image_tasks from '../../../public/coin_logo_tasks.svg'

import { taskService } from '@/services/task.service'

const Tasks: FC = () => {
	const [loading, setLoading] = useState<boolean>(true)
	const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null)
	const { push } = useRouter()

	const { data: tasks } = useQuery({
		queryKey: ['tasks'],
		queryFn: () => taskService.getAllTasks()
	})

	const { mutate: completedTask } = useMutation({
		mutationKey: ['completedTask'],
		mutationFn: async (taskId: string) => {
			await new Promise(resolve => setTimeout(resolve, 3000))
			return taskService.completeTask(taskId)
		},
		onSuccess(data) {
			console.log('Task completed:', data)
			setLoadingTaskId(null)
		},
		onError(error) {
			console.log('Error completing task:', error)
			setLoadingTaskId(null)
		}
	})

	const onSubmit = (taskId: string) => {
		setLoadingTaskId(taskId)
		completedTask(taskId)
	}

	useEffect(() => {
		if (!localStorage.getItem('jwtToken')) {
			push(DASHBOARD_PAGES.AUTH)
		} else {
			setLoading(false)
		}
	}, [])

	// Группируем задачи по типам
	const groupedTasks = tasks?.reduce(
		(acc, task) => {
			const type = task.type
			if (!acc[type]) {
				acc[type] = []
			}
			acc[type].push(task)
			return acc
		},
		{} as Record<TypeTask, ITask[]>
	)

	// Сортируем задачи внутри каждой группы
	const sortTasksByCompletion = (tasks: ITask[]) => {
		return tasks.sort((a, b) => {
			const aCompleted = a.UserTasks?.[0]?.isCompleted || false
			const bCompleted = b.UserTasks?.[0]?.isCompleted || false
			return Number(aCompleted) - Number(bCompleted)
		})
	}

	// Функция для форматирования названия типа
	const formatTaskType = (type: string): string => {
		return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + ' Tasks'
	}

	const renderTaskCard = (task: ITask) => {
		console.log('Task icon:', task.icon)
		console.log('Available icons:', TASK_ICONS)
		console.log('Selected icon:', TASK_ICONS[task.icon as TaskIconType])

		return (
			<div
				key={task.id}
				className={`tasks__card ${
					task.UserTasks?.[0]?.isCompleted ? 'completed' : ''
				}`}
			>
				<div className='tasks__card-content'>
					<Image
						src={TASK_ICONS[task.icon as TaskIconType]}
						alt={`${task.type}_logo`}
						className='tasks__card_img'
						width={24}
						height={24}
					/>
					<p className='tasks__card_text'>
						{task.title}
						<br />+{task.reward} POINTS
					</p>
				</div>

				{loadingTaskId === task.id ? (
					<div className='tasks__card_loader'></div>
				) : (
					<button
						type='submit'
						className='tasks__card_button'
						disabled={task.UserTasks?.[0]?.isCompleted}
						onClick={() => onSubmit(task.id)}
					>
						{task.UserTasks?.[0]?.isCompleted ? 'Completed' : 'Start'}
					</button>
				)}
			</div>
		)
	}

	if (loading) return <Loader size={50} />

	return (
		<>
			<div className='tasks__header'>
				<Image
					className='tasks__img'
					src={image_tasks}
					alt='header image'
				/>
				<h2 className='tasks__title'>
					Perform tasks and pick up KRC <br />
					You can complete {tasks?.length || 0} tasks
				</h2>
			</div>

			<div className='tasks__main'>
				{groupedTasks &&
					Object.entries(groupedTasks).map(([type, tasksOfType]) => (
						<div
							key={type}
							className='tasks__section'
						>
							<h2 className='tasks__title_sec'>
								{formatTaskType(type as string)}
							</h2>
							<div className='tasks__group'>
								{sortTasksByCompletion(tasksOfType).map(renderTaskCard)}
							</div>
						</div>
					))}
			</div>
		</>
	)
}

export default Tasks
