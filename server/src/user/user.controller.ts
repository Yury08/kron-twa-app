import {
	Body,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Decimal } from 'decimal.js'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { CheckRole } from 'src/auth/decorators/role.decorators'
import { CurrentUser } from 'src/auth/decorators/user.decorators'
import { BalanceDto } from './dto/balance.dto'
import { MenuDto } from './dto/menu.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	@HttpCode(200)
	@Auth()
	getUser(@CurrentUser('id') userId: string) {
		return this.userService.getById(userId)
	}

	@UsePipes(new ValidationPipe())
	@Post('/ticket')
	@HttpCode(200)
	@Auth()
	reducingUserTickets(@CurrentUser('id') userId: string) {
		return this.userService.reducingTickets(userId)
	}

	@UsePipes(new ValidationPipe())
	@Post('/balance_up')
	@HttpCode(200)
	@Auth()
	balanceUp(@CurrentUser('id') userId: string, @Body() dto: BalanceDto) {
		let decimalQuantity = new Decimal(dto.quantity)
		return this.userService.updateBalance(decimalQuantity, userId)
	}

	@UsePipes(new ValidationPipe())
	@Post('/menu/create')
	@HttpCode(200)
	@Auth()
	createMenu(@CheckRole() isAdmin: boolean, @Body() dto: MenuDto) {
		if (isAdmin) {
			return this.userService.createMenu(dto)
		}
		throw new NotFoundException(
			'You do not have permission to make this request.'
		)
	}

	@UsePipes(new ValidationPipe())
	@Get('/menu/all')
	@HttpCode(200)
	@Auth()
	getAllMenu(@CheckRole() isAdmin: boolean) {
		if (isAdmin) {
			return this.userService.getAllMenu()
		}
		throw new NotFoundException(
			'You do not have permission to make this request.'
		)
	}

	@UsePipes(new ValidationPipe())
	@Put('/menu/update/:id')
	@HttpCode(200)
	@Auth()
	updateMenu(
		@CheckRole() isAdmin: boolean,
		@Body() dto: MenuDto,
		@Param('id') id: string
	) {
		if (isAdmin) {
			return this.userService.updateMenu(dto, id)
		}
		throw new NotFoundException(
			'You do not have permission to make this request.'
		)
	}
}
