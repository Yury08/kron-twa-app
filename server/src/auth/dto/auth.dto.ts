import { Role } from '@prisma/client'
import { IsOptional, IsString } from 'class-validator'

export class AuthDto {
	@IsString()
	username: string

	@IsString()
	@IsOptional()
	role?: Role

	@IsString()
	tgUsername: string
}
