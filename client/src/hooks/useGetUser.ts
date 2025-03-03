'use client'

import { useQuery } from '@tanstack/react-query'

import { storageService } from '@/services/storage.service'
import { userService } from '@/services/user.service'

function useGetUser(enabled: boolean) {
	const {
		data,
		error,
		refetch: refetchUser,
		isFetching
	} = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			try {
				const user = await storageService.getItem('user')
				if (user) return JSON.parse(user)
				return userService.getUser()
			} catch (error) {
				console.error('Error in useGetUser:', error)
				throw error
			}
		},
		enabled
	})

	return { user: data, error, refetchUser, isFetching }
}

export default useGetUser
