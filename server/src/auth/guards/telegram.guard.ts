import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { cls_rs_jwt } from 'src/utils/rsJwt'

@Injectable()
export class TelegramGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const jwtToken = request.headers.authorization

		if (!jwtToken) return false

		const token = await cls_rs_jwt.decode(
			jwtToken,
			process.env.SECRET_KEY,
			true
		)

		const tgUser = await this.prisma.user.findUnique({
			where: {
				tgUsername: token.payload.payload.tgUsername
			}
		})
		request.user = tgUser
		return true
	}
}
