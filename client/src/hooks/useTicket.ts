import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { userService } from '@/services/user.service'

export const useTicket = () => {
	const { push } = useRouter()

	const { mutate, data } = useMutation({
		mutationKey: ['reducingTickets'],
		mutationFn: () => userService.reducingUserTickets(),
		onSuccess(data) {
			if (data === -1) {
				toast.error("You don't have enough tickets")
				push(DASHBOARD_PAGES.HOME)
			} else {
				push(DASHBOARD_PAGES.GAME)
			}
		}
	})

	return { mutate, data }
}
