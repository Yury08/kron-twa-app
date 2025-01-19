'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { ITaskForm, TypeTask } from '@/types/task.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { taskService } from '@/services/task.service'

const Admin: FC = () => {
	const { push } = useRouter()
	const { register, reset, handleSubmit } = useForm<ITaskForm>({
		mode: 'onChange'
	})

	const { data: tasks, refetch } = useQuery({
		queryKey: ['admin-tasks'],
		queryFn: () => taskService.getAllTasks()
	})

	const { mutate: createTask } = useMutation({
		mutationKey: ['create-task'],
		mutationFn: (data: ITaskForm) => taskService.createTask(data),
		onSuccess: async () => {
			const { toast } = await import('sonner')
			toast.success('Task created successfully')
			reset()
			refetch()
		},
		onError: async error => {
			const { toast } = await import('sonner')
			toast.error('Failed to create task')
			console.error(error)
		}
	})

	useEffect(() => {
		// Проверяем права доступа при загрузке
		const checkAccess = async () => {
			try {
				await taskService.createTask({ title: '' }) // Пробный запрос
			} catch (error) {
				push(DASHBOARD_PAGES.HOME)
			}
		}
		checkAccess()
	}, [])

	const onSubmit: SubmitHandler<ITaskForm> = data => {
		createTask(data)
	}

	return (
		<div className='admin'>
			<h1 className='admin__title'>Admin Panel</h1>

			<div className='admin__form-container'>
				<h2 className='admin__subtitle'>Create New Task</h2>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='admin__form'
				>
					<input
						{...register('title', { required: true })}
						placeholder='Task title'
						className='admin__input'
					/>

					<input
						{...register('reward', { required: true })}
						type='number'
						placeholder='Reward amount'
						className='admin__input'
					/>

					<select
						{...register('type')}
						className='admin__select'
					>
						{Object.values(TypeTask).map(type => (
							<option
								key={type}
								value={type}
							>
								{type}
							</option>
						))}
					</select>

					<select
						{...register('icon')}
						className='admin__select'
					>
						{['wallet', 'telegram', 'instagram', 'default'].map(icon => (
							<option
								key={icon}
								value={icon}
							>
								{icon}
							</option>
						))}
					</select>

					<button
						type='submit'
						className='admin__button'
					>
						Create Task
					</button>
				</form>
			</div>

			<div className='admin__tasks'>
				<h2 className='admin__subtitle'>Existing Tasks</h2>
				<div className='admin__tasks-list'>
					{tasks?.map(task => (
						<div
							key={task.id}
							className='admin__task-card'
						>
							<h3>{task.title}</h3>
							<p>Reward: {task.reward}</p>
							<p>Type: {task.type}</p>
							<p>Icon: {task.icon}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Admin
