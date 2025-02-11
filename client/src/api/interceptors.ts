import axios, { type CreateAxiosDefaults } from 'axios'

import { storageService } from '@/services/storage.service'

const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:5555/api',
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosTelegram = axios.create(options)

// Создаем промежуточное хранилище для токена

axiosTelegram.interceptors.request.use(async config => {
	try {
		const token = await storageService.getItem('jwtToken')
		console.log('Interceptor token:', token)

		if (!token) {
			console.warn('No token found in storage')
			throw new Error('No authorization token found')
		}

		config.headers.Authorization = token
		return config
	} catch (error) {
		console.error('Interceptor error:', error)
		return Promise.reject(error)
	}
})

axiosTelegram.interceptors.response.use(
	response => response,
	error => {
		console.error('API Error:', error)
		return Promise.reject(error)
	}
)

export { axiosClassic, axiosTelegram }
