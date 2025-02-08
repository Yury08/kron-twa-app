import {
	Body,
	Controller,
	HttpCode,
	Post,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { FriendService } from 'src/friend/friend.service'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { AuthQueryDto } from './dto/query.dto'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly friendService: FriendService
	) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('reg')
	async register(@Body() dto: AuthDto, @Query() query_param: AuthQueryDto) {
		const referral_name: string | undefined = query_param['referral']

		if (referral_name) {
			const { user, jwtToken } = await this.authService.register(dto)
			const referral_user = await this.userService.getByUsername(referral_name)
			this.friendService.create(user.username, referral_user.id)
			this.userService.updateTickets(referral_user.id)
			return { user, jwtToken }
		}
		const { user, jwtToken } = await this.authService.register(dto)
		return { user, jwtToken }
	}
}
