import { IBalance } from '@/types/main.types'

import { axiosTelegram } from '../api/interceptors'
import { IUser } from '../types/auth.types'
import { IMenu, IMenuForm } from '../types/menu.types'

import { storageService } from '@/services/storage.service'

export class UserService {
	private URL = '/user'

	async getUser() {
		try {
			const res = await axiosTelegram.get<IUser>(this.URL)
			return res.data
		} catch (error) {
			console.error('Error in getUser service:', error)
			throw error
		}
	}

	// Обновление баланса с обновлением в CloudStorage
	async updateBalance(data: IBalance) {
		const res = await axiosTelegram.post(`${this.URL}/balance_up`, data)
		const user = await this.getUser() // Получаем обновленные данные
		await storageService.setItem('user', JSON.stringify(user))
		return res.data
	}

	// Обновление билетов с обновлением в CloudStorage
	async reducingUserTickets() {
		const { data } = await axiosTelegram.post(`${this.URL}/ticket`)
		if (typeof data === 'string') return -1
		if (data) {
			const user = await this.getUser() // Получаем обновленные данные
			await storageService.setItem('user', JSON.stringify(user))
			return data
		}
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
