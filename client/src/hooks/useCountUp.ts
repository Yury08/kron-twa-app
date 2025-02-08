import { useEffect, useState } from 'react'

interface UseCountUpProps {
	end: number
	duration: number // в секундах
	start?: number
	enabled?: boolean
}

export const useCountUp = ({
	end,
	duration,
	start = 0,
	enabled = true
}: UseCountUpProps) => {
	const [count, setCount] = useState(start)

	useEffect(() => {
		if (!enabled) {
			setCount(start)
			return
		}

		if (duration <= 0) return

		const startTime = Date.now()

		const updateCount = () => {
			const now = Date.now()
			const elapsedTime = (now - startTime) / 1000 // в секундах
			const progress = elapsedTime / duration // Такая же формула как в Farming

			if (progress <= 1) {
				const currentCount = Math.floor(start + (end - start) * progress)
				setCount(currentCount)
				requestAnimationFrame(updateCount)
			} else {
				setCount(end)
			}
		}

		requestAnimationFrame(updateCount)

		return () => {
			setCount(enabled ? end : start)
		}
	}, [end, duration, start, enabled])

	return count
}
