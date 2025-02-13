'use client'

import { useMutation } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import useTelegramInitData from '@/hooks/useTelegramInitData'

import coin_logo_main from '../../../public/coin_logo_main.svg'
import { Field } from '../../components/ui/field'
import { IAuthForm } from '../../types/auth.types'

import { authService } from '@/services/auth.service'

const DynamicImage = dynamic(() => import('next/image'), {
	ssr: false
})

const Auth = () => {
	const { register, reset, handleSubmit } = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const { push } = useRouter()
	const initData = useTelegramInitData()

	if (!initData) {
		console.log('Данные Telegram WebApp еще не загружены')
		return <div>"Telegram WebApp is not open"</div>
	}

	const { user } = initData

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main({
				...data,
				tgUsername: user?.username
			}),
		onSuccess: async () => {
			const { toast } = await import('sonner')
			toast.success('Successfully login')
			reset()
			push(DASHBOARD_PAGES.HOME)
		},
		onError: async (error: any) => {
			const { toast } = await import('sonner')
			// Проверяем, является ли ошибка ошибкой существующего пользователя
			if (error.response?.data?.message === 'User already exists') {
				toast.info('This username is already taken. Please choose another one.')
			} else {
				toast.error('Registration failed. Please try again.')
			}
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	return (
		<>
			<div className='indicate'>
				<div className='indicate__wrapper'>
					<DynamicImage
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
