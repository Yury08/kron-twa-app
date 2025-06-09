'use client'

import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import useGetUser from '@/hooks/useGetUser'

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
	const { push } = useRouter()
	const [isAuth, setIsAuth] = useState(false)
	const { user } = useGetUser(isAuth)
	const [balance, setBalance] = useState<number>(0)
	// const { jettonBalance } = useJettonContract() // баланс jetton
	const { rewardCollected, setRewardCollected } = useFarmingContext()
	const { refetch: refetchBalance } = useQuery({
		queryKey: ['user_balance'],
		queryFn: () => farmingService.getBalance(),
		enabled: false
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				const balanceRes = await refetchBalance()
				if (balanceRes.data) {
					setBalance(balanceRes.data)
				}
			} catch (error) {
				console.error('Failed to fetch balance:', error)
			} finally {
				setLoading(false)
			}
		}
		const refferalName = window.Telegram.WebApp.initDataUnsafe.start_param
		window.Telegram.WebApp.CloudStorage.getItem('jwtToken', (err, token) => {
			if (err || !token) {
				if (refferalName) localStorage.setItem('referralName', refferalName)
				push(DASHBOARD_PAGES.AUTH)
			} else {
				setIsAuth(true)
				fetchData()
			}
		})
		// Удаление токена из telegram storage
		// storageService
		// 	.removeItem('jwtToken')
		// 	.then(() => {
		// 		window.Telegram.WebApp.CloudStorage.getItem(
		// 			'jwtToken',
		// 			(err, token) => {
		// 				if (!err) {
		// 					if (token) {
		// 						setLoading(false)
		// 						refetchBalance().then(res => {
		// 							if (res.data) {
		// 								setBalance(res.data)
		// 							}
		// 						})
		// 					} else {
		// 						push(DASHBOARD_PAGES.AUTH)
		// 					}
		// 				} else {
		// 					console.log(`ERROR - ${err.message}`)
		// 				}
		// 			}
		// 		)
		// 	})
		// 	.catch((error: Error) => {
		// 		console.error('Error removing token:', error)
		// 	})

		// storageService
		// 	.removeItem('user')
		// 	.then(() => {
		// 		window.Telegram.WebApp.CloudStorage.getItem('user', (err, token) => {
		// 			if (!err) {
		// 				if (token) {
		// 					setLoading(false)
		// 					refetchBalance().then(res => {
		// 						if (res.data) {
		// 							setBalance(res.data)
		// 						}
		// 					})
		// 				} else {
		// 					push(DASHBOARD_PAGES.AUTH)
		// 				}
		// 			} else {
		// 				console.log(`ERROR - ${err.message}`)
		// 			}
		// 		})
		// 	})
		// 	.catch((error: Error) => {
		// 		console.error('Error removing token:', error)
		// 	})
	}, [push, refetchBalance])

	useEffect(() => {
		if (rewardCollected) {
			refetchBalance().then(res => {
				if (res.data) {
					setBalance(res.data)
				}
			})
			setRewardCollected(false)
		}
	}, [rewardCollected, refetchBalance])

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
								style={{ cursor: 'pointer' }}
								priority
							/>
							<h3 className='coin__balance'>{`${balance} KRN`}</h3>
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
									onClick={() => push(DASHBOARD_PAGES.GAME)}
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
