import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {
	expires: 30, // 30 дней
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict' as const,
	path: '/'
}

export const cookieService = {
	// Установка значения
	set: (key: string, value: any) => {
		Cookies.set(key, JSON.stringify(value), COOKIE_OPTIONS)
	},

	// Получение значения
	get: (key: string) => {
		const value = Cookies.get(key)
		try {
			return value ? JSON.parse(value) : null
		} catch {
			return value
		}
	},

	// Удаление значения
	remove: (key: string) => {
		Cookies.remove(key, { path: '/' })
	}
}
