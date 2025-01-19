import { DecimalDataType } from 'sequelize'

import { IUser } from './auth.types'
import { IBase } from './main.types'

export interface IFarming extends IBase {
	totalSeconds: number
	isCompleted?: boolean
	amount: DecimalDataType
	user: IUser
	userId: string
}

export interface IFarmingTime {
	expiry: number
}

export type IFarmingResponse = Partial<Omit<IFarming, 'user'>>
