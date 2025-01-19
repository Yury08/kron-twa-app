import { IsNotEmpty, IsNumber } from 'class-validator'

export class FarmingDto {
	@IsNumber()
	@IsNotEmpty()
	expiry: number
}
