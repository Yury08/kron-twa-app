'use client'

import { useMutation } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import useTelegramInitData from '@/hooks/useTelegramInitData'

import coin_logo_main from '../../../public/coin_logo_main.svg'
import { Field } from '../../components/ui/field'
import { IAuthForm, IUser } from '../../types/auth.types'

import { authService } from '@/services/auth.service'
import { storageService } from '@/services/storage.service'

const DynamicImage = dynamic(() => import('next/image'), {
	ssr: false
})

const Auth = () => {
	const [refName, setRefName] = useState<string | null>(null)
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors }
	} = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const { push } = useRouter()
	const initData = useTelegramInitData()
	const { user } = initData ?? {}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const refParam = localStorage.getItem('referralName') || null
			setRefName(refParam)
		}
	}, [])

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) => {
			if (!user?.username) {
				return Promise.reject(new Error('Username is missing'))
			}
			return authService.main(
				{
					...data,
					tgUsername: user.username
				},
				refName
			)
		},
		onSuccess: async (data: IUser) => {
			localStorage.removeItem('referralName')
			await storageService.setItem('user', JSON.stringify(data))
			toast.success('Successfully login')
			reset()
			push(DASHBOARD_PAGES.HOME)
		},
		onError: (error: any) => {
			if (error.response?.data?.message === 'User already exists') {
				toast.info('This username is already taken. Please choose another one.')
			} else {
				toast.error('Registration failed. Please try again.')
			}
		}
	})

	if (!initData) {
		console.log('Данные Telegram WebApp еще не загружены')
		return <div>"Telegram WebApp is not open"</div>
	}

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
								required: 'Username is required',
								validate: {
									noSpaces: value =>
										!/\s/.test(value) || 'Username cannot contain spaces'
								},
								pattern: {
									value: /^[a-zA-Z0-9_]+$/,
									message:
										'Username can only contain letters, numbers and underscores'
								}
							})}
							error={errors.username?.message}
						/>
						<Button type='submit'>Let's farm</Button>
					</form>
				</div>
			</div>
		</>
	)
}

export default Auth
