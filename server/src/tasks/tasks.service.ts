import { Injectable } from '@nestjs/common'
import { TypeTask } from '@prisma/client'
import Decimal from 'decimal.js'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { TasksDto } from './dto/tasks.dto'

@Injectable()
export class TasksService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	async getAllTasks(userId: string) {
		return await this.prisma.task.findMany({
			include: {
				UserTasks: {
					where: {
						userId
					},
					select: {
						isCompleted: true
					}
				}
			}
		})
	}

	async getAll() {
		return await this.prisma.task.findMany()
	}

	async getTasksByThereType(type: TypeTask) {
		return await this.prisma.task.findMany({
			where: {
				type
			}
		})
	}

	async getTask(id: string) {
		return await this.prisma.task.findUnique({
			where: {
				id
			}
		})
	}

	async getUserTask(taskId: string, userId: string) {
		return await this.prisma.userTasks.findFirst({
			where: {
				taskId,
				userId
			}
		})
	}

	// async createTasks(dto: TasksDto) {
	// 	return await this.prisma.task.createMany({
	// 		data: {
	// 			title: dto.title,
	// 			reward: dto.reward,
	// 			type: dto.type
	// 		}
	// 	})
	// }

	async createTask(dto: TasksDto) {
		return await this.prisma.task.create({
			data: dto
		})
	}

	async completeTask(taskId: string, userId: string) {
		const task = await this.getTask(taskId)
		const getUserTask = await this.getUserTask(taskId, userId)
		const updatedTask = await this.prisma.userTasks.update({
			where: {
				id: getUserTask.id
			},
			data: {
				isCompleted: true
			},
			select: {
				isCompleted: true
			}
		})

		this.userService.updateBalance(
			new Decimal(task.reward).dividedBy(1000),
			userId
		)
		return updatedTask
	}
}
