import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class UserDto {
	@IsString()
	@IsOptional()
	username: string

	@IsNumber()
	@IsOptional()
	@Min(0)
	balance: number

	@IsNumber()
	@IsOptional()
	@Min(0)
	tickets: number
}
