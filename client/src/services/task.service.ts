import { axiosTelegram } from '../api/interceptors'
import { ITask, ITaskCompleteResponse, ITaskForm } from '../types/task.types'

export class TaskService {
	private TASK_URL = '/tasks'

	async getAllTasks() {
		const res = await axiosTelegram.get<ITask[]>(`${this.TASK_URL}`)
		return res.data
	}

	async completeTask(taskId: string) {
		const res = await axiosTelegram.post<ITaskCompleteResponse>(
			`${this.TASK_URL}/complete?taskId=${taskId}`
		)
		return res.data
	}

	async createTask(data: ITaskForm) {
		const res = await axiosTelegram.post<ITask>(`${this.TASK_URL}/create`, data)
		return res.data
	}
}

export const taskService = new TaskService()
