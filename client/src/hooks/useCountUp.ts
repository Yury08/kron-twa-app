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
		if (!enabled) return

		const startTime = Date.now()
		const endTime = startTime + duration * 1000

		const updateCount = () => {
			const now = Date.now()
			const progress = Math.min((now - startTime) / (duration * 1000), 1)
			const currentCount = Math.floor(start + (end - start) * progress)

			setCount(currentCount)

			if (progress < 1) {
				requestAnimationFrame(updateCount)
			}
		}

		requestAnimationFrame(updateCount)
	}, [end, duration, start, enabled])

	return count
}
