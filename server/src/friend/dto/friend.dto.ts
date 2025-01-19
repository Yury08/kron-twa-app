import { IsDecimal, IsString } from 'class-validator'

export class FriendDto {
	@IsString()
	username: string

	@IsString()
	userId: string

	@IsDecimal()
	earn: number
}
