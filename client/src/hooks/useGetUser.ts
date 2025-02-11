'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { storageService } from '@/services/storage.service'
import { userService } from '@/services/user.service'

function useGetUser() {
	const { data, isSuccess, error } = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			try {
				// Если нет в кэше, делаем запрос
				const user = await userService.getUser()
				return user
			} catch (error) {
				console.error('Error in useGetUser:', error)
				throw error
			}
		}
	})

	// Обновляем данные в CloudStorage при изменении
	useEffect(() => {
		const updateUser = async () => {
			if (data) {
				await storageService.setItem('user', JSON.stringify(data))
			}
		}

		updateUser()
	}, [isSuccess])

	useEffect(() => {
		if (error) {
			console.error('Query error:', error)
		}
	}, [error])

	return { user: data, error }
}

export default useGetUser
