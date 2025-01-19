'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { FC, useEffect, useState } from 'react'

import { useJettonContract } from '@/hooks/ton/useJettonContract'
import { useTonConnect } from '@/hooks/ton/useTonConnect'
import { useCountUp } from '@/hooks/useCountUp'
import { useTimer } from '@/hooks/useTimer'

import { useFarmingContext } from '@/context/FarmingContext'
import { farmingService } from '@/services/farming.service'

const Farming: FC = () => {
	const { setRewardCollected } = useFarmingContext()
	const { connected } = useTonConnect()
	const { mint, refetchBalance } = useJettonContract()

	const expiry = 20 // секунды

	const [ttl, setTtl] = useState<number>(0)

	let isClaim = localStorage.getItem('isClaim') || 'false'
	const storedData = localStorage.getItem('farm') || ''
	const farmAmount = storedData ? JSON.parse(storedData).amount : 0

	const { refetch } = useQuery({
		queryKey: ['farm_ttl'],
		queryFn: () => farmingService.getTtl() // 0 || sec
	})

	useEffect(() => {
		refetch().then(res => {
			setTtl(res.data)
			if (res.data > 0) {
				setIsActive(true)
			}
		})
	}, [])

	const { startTimer, resetTimer, formatTime, isActive, setIsActive } =
		useTimer({
			initialSeconds: ttl
		})

	// Анимированный счетчик
	const animatedCount = useCountUp({
		end: farmAmount,
		duration: ttl || expiry,
		start: 0,
		enabled: isActive
	})

	const startFarm = useMutation({
		mutationKey: ['start'],
		mutationFn: () => farmingService.startFarming({ expiry }), // {userId_isFarming: true}
		async onSuccess(data) {
			const { toast } = await import('sonner')
			toast.success('Farming started success!')
			localStorage.setItem('farm', JSON.stringify(data))
			startTimer(expiry)
		}
	})

	useEffect(() => {
		if (ttl > 0) startTimer(ttl)
	}, [ttl])

	const claim = useMutation({
		mutationKey: ['claim'],
		mutationFn: () => farmingService.claimFarming(), // {userId_isFarming: false}, {userId_balance: ...}
		async onSuccess() {
			const { toast } = await import('sonner')
			toast.success('The reward has been collected')
			resetTimer(expiry)
			setRewardCollected(true)
		}
	})

	const onClickClaim = async () => {
		// if (connected) {
		await claim.mutate()
		// await mint()
		await refetchBalance()
		// } else {
		// 	const { toast } = await import('sonner')
		// 	toast.error('Connect your wallet!')
		// }
	}

	return (
		<div className='farming__block'>
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
						<p className='farming__balance'>farming: {animatedCount} KRC</p>
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
