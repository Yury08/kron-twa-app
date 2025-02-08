'use client'

import { FC, useEffect, useRef } from 'react'

import { Star } from '@/types/game.types'

const StarBackground: FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const starsRef = useRef<Star[]>([])
	const animationFrameRef = useRef<number>()

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Устанавливаем размеры canvas
		const setCanvasSize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}

		// Инициализируем звезды только один раз
		const initStars = () => {
			starsRef.current = Array.from({ length: 150 }, () => ({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 1.5,
				alpha: Math.random(),
				velocity: Math.random() * 0.15
			}))
		}

		const animate = () => {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			starsRef.current.forEach(star => {
				// Обновляем позицию
				star.y += star.velocity
				star.alpha = Math.sin(Date.now() * 0.001 + star.x) * 0.5 + 0.5

				// Возвращаем звезду наверх если она вышла за пределы
				if (star.y > canvas.height) {
					star.y = 0
					star.x = Math.random() * canvas.width
				}

				// Рисуем звезду
				ctx.beginPath()
				ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
				ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`
				ctx.fill()
			})

			animationFrameRef.current = requestAnimationFrame(animate)
		}

		// Обработчик изменения размера окна
		const handleResize = () => {
			setCanvasSize()
			initStars()
		}

		setCanvasSize()
		initStars()
		animate()

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [])

	return (
		<canvas
			ref={canvasRef}
			className='fixed inset-0 -z-10'
			style={{ background: 'black' }}
		/>
	)
}

export default StarBackground
