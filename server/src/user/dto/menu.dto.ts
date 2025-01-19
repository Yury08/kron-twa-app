import { IsOptional, IsString } from 'class-validator'

export class MenuDto {
	@IsString()
	@IsOptional()
	title?: string

	@IsString()
	@IsOptional()
	link?: string

	@IsString()
	@IsOptional()
	icon?: string
}
