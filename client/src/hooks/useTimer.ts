'use client'

import { useCallback, useEffect, useState } from 'react'

interface ITimerProps {
	initialSeconds?: number
}

export const useTimer = ({ initialSeconds = 0 }: ITimerProps) => {
	const [seconds, setSeconds] = useState<number>(initialSeconds)
	const [isActive, setIsActive] = useState<boolean>(false)

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null

		if (isActive && seconds > 0) {
			interval = setInterval(() => {
				setSeconds(prevSeconds => {
					if (prevSeconds <= 1) {
						window.Telegram.WebApp.CloudStorage.setItem('isClaim', 'true')
						setIsActive(false)
						return 0
					}
					return prevSeconds - 1
				})
			}, 1000)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [seconds, isActive])

	const startTimer = useCallback((duration?: number) => {
		if (duration !== undefined) {
			setSeconds(duration)
		}
		setIsActive(true)
	}, [])

	const resetTimer = useCallback(
		(duration?: number) => {
			setIsActive(false)
			window.Telegram.WebApp.CloudStorage.setItem('isClaim', 'false')
			setSeconds(duration || initialSeconds)
		},
		[initialSeconds]
	)

	const formatTime = useCallback((totalSeconds: number) => {
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const remainingSeconds = totalSeconds % 60

		return {
			hours,
			minutes,
			seconds: remainingSeconds,
			formatted: `${hours.toString().padStart(2, '0')}:${minutes
				.toString()
				.padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
		}
	}, [])

	return {
		seconds,
		setIsActive,
		isActive,
		startTimer,
		resetTimer,
		formatTime: formatTime(seconds)
	}
}
