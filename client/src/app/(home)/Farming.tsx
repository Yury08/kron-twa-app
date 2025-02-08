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

	const expiry = 14400 // 4 часа в секундах

	const [ttl, setTtl] = useState<number>(0)
	const [currentAmount, setCurrentAmount] = useState(0)
	const [startAmount, setStartAmount] = useState(0) // Добавляем состояние для начального значения

	// Получаем сохраненные данные
	const isClaim = localStorage.getItem('isClaim') || 'false'
	const storedData = localStorage.getItem('farm')
	const farmAmount = storedData ? Number(JSON.parse(storedData).amount) : 0

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

	useEffect(() => {
		refetchTtl().then(res => {
			const remainingTime = res.data
			if (remainingTime > 0) {
				setTtl(remainingTime)
				setIsActive(true)

				const elapsedTime = expiry - remainingTime // Вычисляем прошедшее время
				const accumulatedAmount = calculateAccumulatedAmount(
					expiry,
					elapsedTime,
					farmAmount
				)
				setStartAmount(accumulatedAmount) // Начальное значение - уже накопленная сумма
				setCurrentAmount(farmAmount * 1000) // Конечное значение
			}
		})
	}, [])

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
			localStorage.setItem('farm', JSON.stringify(data))
			setStartAmount(0)
			setCurrentAmount(Number(data.amount) * 1000) // Умножаем на 1000
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
				{JSON.parse(isClaim) ? (
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
