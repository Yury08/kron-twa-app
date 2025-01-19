import { TypeTask } from '@prisma/client'
import { IsNumber, IsString } from 'class-validator'

export class TasksDto {
	@IsString()
	title: string

	@IsNumber()
	reward: number

	@IsString()
	type: TypeTask
}
