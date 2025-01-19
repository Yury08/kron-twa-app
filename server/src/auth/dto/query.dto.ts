import { IsOptional, IsString } from 'class-validator'

export class AuthQueryDto {
	@IsOptional()
	@IsString()
	referral: string
}
