import { useMutation } from '@tanstack/react-query'

import { IBalance } from '@/types/main.types'

import { userService } from '@/services/user.service'

export const useUpdateBalance = () => {
	const { mutate: updateUserBalance } = useMutation({
		mutationKey: ['updateBalance'],
		mutationFn: (data: IBalance) => userService.updateBalance(data),
		onError(e) {
			console.log(e)
		}
	})

	return { updateUserBalance }
}
