'use client'

import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import useGetUser from '@/hooks/useGetUser'
import { useTicket } from '@/hooks/useTicket'

import coin_logo_main from '../../../public/coin_logo_main.svg'
import ticket from '../../../public/ticket.svg'

import { Header } from './Header'
import { useFarmingContext } from '@/context/FarmingContext'
import { farmingService } from '@/services/farming.service'

const DynamicFarming = dynamic(() => import('./Farming'), {
	loading: () => <Loader size={30} />,
	ssr: false
})

const Home: FC = () => {
	const [loading, setLoading] = useState(true)
	// const [showJettonBalance, setShowJettonBalance] = useState(false)
	const { push } = useRouter()
	const { user } = useGetUser()
	const [balance, setBalance] = useState<number>(0)
	// const { jettonBalance } = useJettonContract() // баланс jetton
	const { rewardCollected, setRewardCollected } = useFarmingContext()

	const { refetch } = useQuery({
		queryKey: ['user_balance'],
		queryFn: () => farmingService.getBalance(),
		enabled: false
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
		window.Telegram.WebApp.setBackgroundColor('#000000')
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

	// const toggleBalance = () => {
	// 	setShowJettonBalance(prev => !prev)
	// }

	// if (loading) return <Loader size={50} />

	return (
		<>
			{loading ? (
				<Loader size={50} />
			) : (
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
								// onClick={toggleBalance}
								style={{ cursor: 'pointer' }}
								priority
							/>
							<h3 className='coin__balance'>
								{/* {showJettonBalance
									? `${jettonBalance ?? '0'} KRN`
									: `${balance} POINTS`} */}
								{balance} KRN
							</h3>
							<p className='coin__text'>
								invite friends and completed tasks for
								<Image
									src={ticket}
									className='inline'
									alt='ticket'
									priority
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
										priority
									/>
								</div>
							</div>
						</div>

						<DynamicFarming />
					</div>
				</>
			)}
		</>
	)
}

export default Home
