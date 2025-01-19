'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { userService } from '@/services/user.service'

function useGetUser() {
	const { data, isSuccess } = useQuery({
		queryKey: ['user'],
		queryFn: () => userService.getUser()
	})

	useEffect(() => {
		localStorage.setItem('user', JSON.stringify(data))
	}, [isSuccess])
	return { user: data }
}

export default useGetUser
