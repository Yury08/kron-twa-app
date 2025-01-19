import {
	Body,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Post,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
// Добавить декоратор CheckRole
import { Auth } from 'src/auth/decorators/auth.decorators'
import { CheckRole } from 'src/auth/decorators/role.decorators'
import { CurrentUser } from 'src/auth/decorators/user.decorators'
import { TasksDto } from './dto/tasks.dto'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get()
	@Auth()
	getAll(@CurrentUser('id') userId: string) {
		return this.tasksService.getAllTasks(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('/create')
	@Auth()
	createTask(@Body() dto: TasksDto, @CheckRole() isAdmin: boolean) {
		if (isAdmin) {
			return this.tasksService.createTask(dto)
		}
		throw new NotFoundException(
			'You do not have permission to make this request.'
		)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('/complete')
	@Auth()
	completeTask(@Query('taskId') id: string, @CurrentUser('id') userId: string) {
		return this.tasksService.completeTask(id, userId)
	}
}
