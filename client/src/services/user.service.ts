import { IBalance } from '@/types/main.types'

import { axiosTelegram } from '../api/interceptors'
import { IUser } from '../types/auth.types'
import { IMenu, IMenuForm } from '../types/menu.types'

export class UserService {
	private URL = '/user'

	async getUser() {
		const res = await axiosTelegram.get<IUser>(this.URL)
		return res.data
	}

	// билеты
	async reducingUserTickets() {
		const { data } = await axiosTelegram.post(`${this.URL}/ticket`)
		if (typeof data === 'string') return -1
		if (data) return data
	}

	// обновление баланса
	async updateBalance(data: IBalance) {
		const res = await axiosTelegram.post(`${this.URL}/balance_up`, data)
		return res.data
	}

	// только для admin пользователей
	async createMenu(data: IMenuForm) {
		const res = await axiosTelegram.post<IMenu>(`${this.URL}/menu/create`, data)
		return res.data
	}

	async getAllMenu() {
		const res = await axiosTelegram.get<IMenu[]>(`${this.URL}/menu/all`)
		return res.data
	}

	async updateMenu(id: string, data: IMenuForm) {
		const res = await axiosTelegram.put(`${this.URL}/menu/update/${id}`, data)
		return res.data
	}
}

export const userService = new UserService()
