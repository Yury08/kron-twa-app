import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { CurrentUser } from 'src/auth/decorators/user.decorators'
import { FarmingDto } from './dto/farming.dto'
import { FarmingService } from './farming.service'

@Controller('farming')
export class FarmingController {
	constructor(private readonly farmingService: FarmingService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post('/start')
	startFarming(@CurrentUser('id') userId: string, @Body() dto: FarmingDto) {
		return this.farmingService.startFarming(userId, dto.expiry)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post('/claim')
	stopFarming(@CurrentUser('id') userId: string) {
		return this.farmingService.getFarmingValue(userId)
	}

	@UsePipes(new ValidationPipe())
	@Get('/get')
	@HttpCode(200)
	@Auth()
	getFarming(@CurrentUser('id') userId: string) {
		return this.farmingService.getFarming(userId)
	}

	@UsePipes(new ValidationPipe())
	@Get('/ttl')
	@HttpCode(200)
	@Auth()
	getTtl(@CurrentUser('id') userId: string) {
		return this.farmingService.getTtl(userId)
	}

	@UsePipes(new ValidationPipe())
	@Get('/balance')
	@HttpCode(200)
	@Auth()
	getBalance(@CurrentUser('id') userId: string) {
		return this.farmingService.getBalance(userId)
	}
}
