'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { FC, useEffect, useState } from 'react'

import { useTonConnect } from '@/hooks/ton/useTonConnect'
import { useCountUp } from '@/hooks/useCountUp'
import { useTimer } from '@/hooks/useTimer'

import { useFarmingContext } from '@/context/FarmingContext'
import { farmingService } from '@/services/farming.service'

const Farming: FC = () => {
	const { setRewardCollected } = useFarmingContext()
	const { connected } = useTonConnect()
	// const { refetchBalance } = useJettonContract()

	const expiry = 120 // 14400 // 4 часа в секундах

	const [ttl, setTtl] = useState<number>(0)
	const [currentAmount, setCurrentAmount] = useState(0)
	const [startAmount, setStartAmount] = useState(0) // Добавляем состояние для начального значения
	const [isClaim, setIsClaim] = useState('false')
	const [farmData, setFarmData] = useState<any>(null)
	const [farmStartTime, setFarmStartTime] = useState<number | null>(null)

	// Загрузка данных из CloudStorage
	useEffect(() => {
		const loadStorageData = () => {
			window.Telegram.WebApp.CloudStorage.getItem('isClaim', (err, value) => {
				if (!err) {
					setIsClaim(value || 'false')
				}
			})

			window.Telegram.WebApp.CloudStorage.getItem('farm', (err, value) => {
				if (!err && value) {
					const data = JSON.parse(value)
					setFarmData(data)
				}
			})

			// Загружаем время начала фарминга
			window.Telegram.WebApp.CloudStorage.getItem(
				'farmStartTime',
				(err, value) => {
					if (!err && value) {
						setFarmStartTime(Number(value))
					}
				}
			)
		}

		loadStorageData()
		const interval = setInterval(loadStorageData, 1000)
		return () => clearInterval(interval)
	}, [])

	const farmAmount = farmData ? Number(farmData.amount) : 0

	// Запрос TTL
	const { refetch: refetchTtl } = useQuery({
		queryKey: ['farm_ttl'],
		queryFn: () => farmingService.getTtl() // 0 || sec
	})

	// Форматирование числа с 3 знаками после запятой
	const formatNumber = (num: number) => {
		return (num / 1000).toFixed(3)
	}

	// Вычисляем накопленную сумму на основе прошедшего времени
	const calculateAccumulatedAmount = (
		totalTime: number,
		elapsedTime: number,
		totalAmount: number
	) => {
		const progress = elapsedTime / totalTime // Прогресс от 0 до 1
		return Math.floor(totalAmount * progress * 1000)
	}

	// Вычисляем прогресс при загрузке
	useEffect(() => {
		if (farmStartTime && farmData) {
			const currentTime = Date.now()
			const elapsedTime = Math.floor((currentTime - farmStartTime) / 1000)
			const remainingTime = Math.max(expiry - elapsedTime, 0)

			if (remainingTime > 0) {
				setTtl(remainingTime)
				setIsActive(true)

				const accumulatedAmount = calculateAccumulatedAmount(
					expiry,
					elapsedTime,
					Number(farmData.amount)
				)
				setStartAmount(accumulatedAmount)
				setCurrentAmount(Number(farmData.amount) * 1000)
			} else if (remainingTime === 0) {
				// Если время вышло, устанавливаем claim
				window.Telegram.WebApp.CloudStorage.setItem('isClaim', 'true')
				setIsClaim('true')
			}
		}
	}, [farmStartTime, farmData])

	const { startTimer, resetTimer, formatTime, isActive, setIsActive } =
		useTimer({
			initialSeconds: ttl
		})

	// Анимированный счетчик
	const animatedCount = useCountUp({
		end: currentAmount,
		duration: ttl || expiry,
		start: startAmount, // Начинаем с накопленной суммы
		enabled: isActive
	})

	// Старт фарминга
	const startFarm = useMutation({
		mutationKey: ['start'],
		mutationFn: () => farmingService.startFarming({ expiry }),
		onSuccess: async data => {
			const { toast } = await import('sonner')
			toast.success('Farming started success!')

			const startTime = Date.now()
			window.Telegram.WebApp.CloudStorage.setItem('farm', JSON.stringify(data))
			window.Telegram.WebApp.CloudStorage.setItem(
				'farmStartTime',
				startTime.toString()
			)
			window.Telegram.WebApp.CloudStorage.setItem('isClaim', 'false')

			setFarmStartTime(startTime)
			setFarmData(data)
			setStartAmount(0)
			setCurrentAmount(Number(data.amount) * 1000)
			startTimer(expiry)
			setIsActive(true)
		}
	})

	// Получение награды
	const claim = useMutation({
		mutationKey: ['claim'],
		mutationFn: () => farmingService.claimFarming(),
		onSuccess: async () => {
			const { toast } = await import('sonner')
			toast.success('The reward has been collected')

			// Очищаем данные фарминга
			window.Telegram.WebApp.CloudStorage.removeItem('farmStartTime')
			window.Telegram.WebApp.CloudStorage.setItem('isClaim', 'false')

			setFarmStartTime(null)
			resetTimer(expiry)
			setRewardCollected(true)
			setCurrentAmount(0)
			setIsActive(false)
		}
	})

	useEffect(() => {
		refetchTtl()
	}, [])

	useEffect(() => {
		if (ttl > 0) {
			startTimer(ttl)
			setIsActive(true)
		}
	}, [ttl])

	const onClickClaim = async () => {
		// if (connected) {
		await claim.mutate()
		// await mint()
		// await refetchBalance()
		// } else {
		// 	const { toast } = await import('sonner')
		// 	toast.error('Connect your wallet!')
		// }
	}

	return (
		<div className='farming__block no-select'>
			<div className='farming__container'>
				{isClaim === 'true' ? (
					<div
						onClick={onClickClaim}
						className='farming__start'
					>
						<p className='farming__text'>claim</p>
					</div>
				) : isActive ? (
					<div className='farming'>
						<p className='farming__balance'>
							farming: {formatNumber(animatedCount)} KRN
						</p>
						<p className='farming__timer'>{formatTime.formatted}</p>
					</div>
				) : (
					<div
						onClick={() => startFarm.mutate()}
						className='farming__start'
					>
						<p className='farming__text'>start farming</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Farming
