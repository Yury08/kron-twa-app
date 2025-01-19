import { RefObject, useState } from 'react'

import { Mouse } from '@/types/game.types'

import BackgroundParticle from '@/tools/BackgroundParticle'
import Enemy from '@/tools/Enemy'
import Particle from '@/tools/Particle'
import Player from '@/tools/Player'
import PowerUp from '@/tools/PowerUp'
import Projectile from '@/tools/Projectile'

export const useGameState = (
	canvasRef: RefObject<HTMLCanvasElement>,
	player: Player | undefined
) => {
	const [projectiles, setProjectiles] = useState<Projectile[]>([])
	const [particles, setParticles] = useState<Particle[]>([])
	const [enemys, setEnemys] = useState<Enemy[]>([])
	const [powerUps, setPowerUps] = useState<PowerUp[]>([])
	const [isGameOver, setIsGameOver] = useState(false)
	const [isGameStarted, setIsGameStarted] = useState(false)
	const [scoreEl, setScoreEl] = useState<number>(0)
	const [backgroundParticles, setBackgroundParticles] = useState<
		BackgroundParticle[]
	>([])

	const startGame = () => {
		setIsGameStarted(true)
		setIsGameOver(false)
		setScoreEl(0)
		setProjectiles([])
		setParticles([])
		setEnemys([])
		setPowerUps([])
		if (player) {
			player.x = (canvasRef.current?.width as number) / 2
			player.y = (canvasRef.current?.height as number) / 2
		}
	}

	const mouse: Mouse = {
		down: false,
		x: undefined,
		y: undefined
	}

	return {
		mouse,
		projectiles,
		setProjectiles,
		particles,
		setParticles,
		enemys,
		setEnemys,
		powerUps,
		setPowerUps,
		isGameOver,
		setIsGameOver,
		isGameStarted,
		scoreEl,
		setScoreEl,
		startGame,
		backgroundParticles,
		setBackgroundParticles
	}
}
