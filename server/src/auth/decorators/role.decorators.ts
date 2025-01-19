import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { cls_rs_jwt } from 'src/utils/rsJwt'

export const CheckRole = createParamDecorator(
	async (data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const jwtToken = request.headers.authorization

		if (!jwtToken) return false

		const token = await cls_rs_jwt.decode(
			jwtToken,
			process.env.SECRET_KEY,
			true
		)

		if (token.payload.payload.role === 'admin') {
			return true
		}

		return false
	}
)
