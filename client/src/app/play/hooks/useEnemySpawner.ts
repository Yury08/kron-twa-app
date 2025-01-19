import { useEffect } from 'react'

import { UseEnemySpawnerProps } from '@/types/game.types'

import Enemy from '@/tools/Enemy'

export const useEnemySpawner = ({
	canvasRef,
	isGameOver,
	setEnemys
}: UseEnemySpawnerProps) => {
	useEffect(() => {
		if (isGameOver || !canvasRef.current) return

		const spawnEnemy = () => {
			const radius = Math.random() * (30 - 7) + 7
			let enemy_x: number
			let enemy_y: number

			if (Math.random() < 0.5) {
				enemy_x =
					Math.random() < 0.5
						? 0 - radius
						: (canvasRef.current?.width as number) + radius
				enemy_y = Math.random() * (canvasRef.current?.height as number)
			} else {
				enemy_x = Math.random() * (canvasRef.current?.width as number)
				enemy_y =
					Math.random() < 0.5
						? 0 - radius
						: (canvasRef.current?.height as number) + radius
			}

			const color = `hsl(${Math.random() * 360}, 50%, 50%)`
			const angle = Math.atan2(
				(canvasRef.current?.height as number) / 2 - enemy_y,
				(canvasRef.current?.width as number) / 2 - enemy_x
			)
			const speed = 1
			const velocity = {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed
			}

			setEnemys(prev => [
				...prev,
				new Enemy(enemy_x, enemy_y, radius, color, velocity)
			])
		}

		// Устанавливаем интервал спавна врагов
		const intervalId = setInterval(spawnEnemy, 1000)

		// Очищаем интервал при завершении игры
		return () => {
			clearInterval(intervalId)
		}
	}, [canvasRef, isGameOver, setEnemys])
}
