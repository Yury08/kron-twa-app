import { axiosClassic } from '../api/interceptors'
import { IAuthForm, IAuthResponse } from '../types/auth.types'

import { storageService } from './storage.service'

export class AuthService {
	async main(data: IAuthForm, referralName: string | null) {
		const res = await axiosClassic.post<IAuthResponse>(`/auth/reg`, data, {
			params: { referral: referralName }
		})
		if (!res.data.jwtToken) throw new Error('No jwtToken')

		await storageService.setItem('jwtToken', res.data.jwtToken)
		return res.data.user
	}
}

export const authService = new AuthService()
