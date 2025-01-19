import { useEffect } from 'react'

import { UsePowerUpsSpawnerProps } from '@/types/game.types'

import PowerUp from '@/tools/PowerUp'

export const usePowerUpsSpawner = ({
	canvasRef,
	isGameOver,
	setPowerUps
}: UsePowerUpsSpawnerProps) => {
	useEffect(() => {
		function spawnPowerUps() {
			let powerUp_x: number
			let powerUp_y: number

			if (Math.random() < 0.5) {
				powerUp_x =
					Math.random() < 0.5 ? 0 - 7 : (canvasRef.current?.width as number) + 7
				powerUp_y = Math.random() * (canvasRef.current?.height as number)
			} else {
				powerUp_x = Math.random() * (canvasRef.current?.width as number)
				powerUp_y =
					Math.random() < 0.5
						? 0 - 9
						: (canvasRef.current?.height as number) + 9
			}

			const angel = Math.atan2(
				(canvasRef.current?.height as number) / 2 - powerUp_y,
				(canvasRef.current?.width as number) / 2 - powerUp_x
			)

			const velocity = {
				x: Math.cos(angel),
				y: Math.sin(angel)
			}

			setPowerUps(prev => [
				...prev,
				new PowerUp(powerUp_x, powerUp_y, velocity)
			])
		}

		const intervalId = setInterval(spawnPowerUps, 4000)

		return () => {
			clearInterval(intervalId)
		}
	}, [canvasRef, isGameOver, setPowerUps])
}
