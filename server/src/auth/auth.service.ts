import { BadRequestException, Injectable } from '@nestjs/common'
import { Task } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { TasksService } from 'src/tasks/tasks.service'
import { UserService } from 'src/user/user.service'
import { cls_rs_jwt } from 'src/utils/rsJwt'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private tasksService: TasksService,
		private prisma: PrismaService
	) {}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByUsername(dto.username)
		if (oldUser) throw new BadRequestException('User already exists')

		const user = await this.userService.create(dto)
		await this.prisma.farming.create({ data: { userId: user.id } })

		const tasks: Task[] = await this.tasksService.getAll()

		const jwtToken = await cls_rs_jwt.encode(
			{ payload: dto },
			process.env.SECRET_KEY
		)

		if (tasks) {
			this.prisma.$transaction(async prisma => {
				const usersTask = tasks.map(task => ({
					isCompleted: false,
					title: task.title,
					taskId: task.id,
					userId: user.id
				}))

				await prisma.userTasks.createMany({
					data: usersTask
				})
			})
		}

		return { jwtToken, user }
	}
}
