import { axiosClassic } from '../api/interceptors'
import { IAuthForm, IAuthResponse } from '../types/auth.types'

export class AuthService {
	async main(data: IAuthForm) {
		const res = await axiosClassic.post<IAuthResponse>(`/auth/reg`, data)
		// localStorage.setItem('telegram_username', data.username)
		if (!res.data.jwtToken) throw new Error('No jwtToken')

		localStorage.setItem('jwtToken', res.data.jwtToken)

		return res.data.user
	}
}

export const authService = new AuthService()
