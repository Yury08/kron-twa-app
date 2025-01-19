import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

@Module({
	controllers: [TasksController],
	providers: [TasksService, PrismaService, UserService],
	exports: [TasksService]
})
export class TasksModule {}
