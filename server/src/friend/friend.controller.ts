import {
	Controller,
	Get,
	HttpCode,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { CurrentUser } from 'src/auth/decorators/user.decorators'
import { FriendService } from './friend.service'

@Controller('friend')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@UsePipes(new ValidationPipe())
	@Get('all')
	@HttpCode(200)
	@Auth()
	getAll(@CurrentUser('id') userId: string) {
		// this.friendService.updateEarning(userId)
		return this.friendService.allFriendsUser(userId)
	}

	@UsePipes(new ValidationPipe())
	@Put('update')
	@HttpCode(200)
	@Auth()
	update(@CurrentUser('id') userId: string) {
		return this.friendService.updateEarning(userId)
	}

	@UsePipes(new ValidationPipe())
	@Post('claim')
	@HttpCode(200)
	@Auth()
	claim(@CurrentUser('id') userId: string) {
		return this.friendService.getFriendsEarning(userId)
	}
}
