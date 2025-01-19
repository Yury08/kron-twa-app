export interface IAuthForm {
	username: string
	tgUsername: TelegramUser['username']
}

export interface TelegramUser {
	id: number
	is_bot: boolean
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
	photo_url?: string
}

export interface IUser {
	id: string
	username: string
	referralLink: string
	balance: number
	tickets: number
	role: Role
	tgUsername: string
}

export enum Role {
	user,
	admin
}

export interface IAuthResponse {
	jwtToken: string
	user: IUser
}
