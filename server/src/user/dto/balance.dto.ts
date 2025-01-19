import { IsNumber } from 'class-validator'

export class BalanceDto {
	@IsNumber()
	quantity: number
}
