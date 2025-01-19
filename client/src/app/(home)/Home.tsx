'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { useJettonContract } from '@/hooks/ton/useJettonContract'
import useGetUser from '@/hooks/useGetUser'
import { useTicket } from '@/hooks/useTicket'

import coin_logo_main from '../../../public/coin_logo_main.svg'
import ticket from '../../../public/ticket.svg'

import Farming from './Farming'
import { Header } from './Header'
import { useFarmingContext } from '@/context/FarmingContext'
import { farmingService } from '@/services/farming.service'

const Home: FC = () => {
	const [loading, setLoading] = useState(true)
	const [showJettonBalance, setShowJettonBalance] = useState(false)
	const { push } = useRouter()
	const { user } = useGetUser()
	const [balance, setBalance] = useState<number>(0)
	const { jettonBalance } = useJettonContract()
	const { rewardCollected, setRewardCollected } = useFarmingContext()

	const { refetch } = useQuery({
		queryKey: ['user_balance'],
		queryFn: () => farmingService.getBalance()
	})

	const { mutate } = useTicket()

	useEffect(() => {
		if (rewardCollected) {
			refetch().then(res => {
				if (res.data) {
					setBalance(res.data)
				}
			})
			setRewardCollected(false) // Сброс состояния, если нужно
		}
	}, [rewardCollected])

	useEffect(() => {
		// localStorage.setItem(
		// 	'jwtToken',
		// 	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7InVzZXJuYW1lIjoiWXVyeSIsInRnVXNlcm5hbWUiOiJZdXJ5X0tyYXZ6b3YifX0.favQTM1GY_QemUWr3Nj3kRS-kaeVuxpGewDzVNdb1-s'
		// )
		if (!localStorage.getItem('jwtToken')) {
			push(DASHBOARD_PAGES.AUTH)
		} else {
			setLoading(false)
			refetch().then(res => {
				if (res.data) {
					setBalance(res.data)
				}
			})
		}
	}, [])

	const toggleBalance = () => {
		setShowJettonBalance(prev => !prev)
	}

	if (loading) return <Loader size={50} />

	return (
		<>
			<Header user={user} />

			<div className='main-content'>
				<div className='coin'>
					<Image
						className='coin__main-img'
						src={coin_logo_main}
						width={250}
						height={250}
						alt='coin image'
						onClick={toggleBalance}
						style={{ cursor: 'pointer' }}
					/>
					<h3 className='coin__balance'>
						{showJettonBalance
							? `${jettonBalance ?? '0'} KRC`
							: `${balance} POINTS`}
					</h3>
					<p className='coin__text'>
						invite friends and completed tasks for
						<Image
							src={ticket}
							className='inline'
							alt='ticket'
						/>
					</p>
				</div>

				<div className='game'>
					<div className='game__content'>
						<button
							onClick={() => mutate()}
							className='game__button'
						>
							Play game
						</button>
						<div className='game__info'>
							<span className='game__attempts'>{user?.tickets}</span>
							<Image
								src={ticket}
								className='inline'
								alt='ticket'
							/>
						</div>
					</div>
				</div>

				<Farming />
			</div>
		</>
	)
}

export default Home
