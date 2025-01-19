'use client'

import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import useTelegramInitData from '@/hooks/useTelegramInitData'

import coin_logo_main from '../../../public/coin_logo_main.svg'
import { Button } from '../../components/ui/button'
import { Field } from '../../components/ui/field'
import { IAuthForm } from '../../types/auth.types'

import { authService } from '@/services/auth.service'

const Auth = () => {
	const { register, reset, handleSubmit } = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const { push } = useRouter()
	const { user } = useTelegramInitData()

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main({
				...data,
				tgUsername: user?.username // tg_test_${data.username} для теста
			}),
		async onSuccess() {
			const { toast } = await import('sonner')
			toast.success('Successfully login')
			reset()
			push(DASHBOARD_PAGES.HOME)
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	return (
		<>
			<div className='indicate'>
				<div className='indicate__wrapper'>
					<Image
						src={coin_logo_main}
						alt='coin image'
						width={300}
						height={300}
					/>
					<form
						className='indicate__form'
						onSubmit={handleSubmit(onSubmit)}
					>
						<Field
							id='username'
							placeholder='indicate the name'
							{...register('username', {
								required: 'Username is required'
							})}
						/>
						<Button type='submit'>Let's farm</Button>
					</form>
				</div>
			</div>
		</>
	)
}

export default Auth
