import { IUser } from './auth.types'
import { IBase } from './main.types'

export interface IFriend extends IBase {
	username: string
	earn: string
	user: IUser
	userId: string
}
