'use client'

import { FC, useEffect, useRef, useState } from 'react'

import GameStarted from './GameStarted'
import { useEnemySpawner } from './hooks/useEnemySpawner'
import { useGameAnimation } from './hooks/useGameAnimation'
import { useGameState } from './hooks/useGameState'
import { usePowerUpsSpawner } from './hooks/usePowerUpsSpawner'
import BackgroundParticle from '@/tools/BackgroundParticle'
import Player from '@/tools/Player'

const Game: FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationIdRef = useRef<number>()
	const animationEnemyIdRef = useRef<number>()
	const [ctx, setCtx] = useState<CanvasRenderingContext2D>()
	const [player, setPlayer] = useState<Player>()

	// Canvas initialization
	useEffect(() => {
		if (!canvasRef.current) return
		canvasRef.current.width = window.innerWidth
		canvasRef.current.height = window.innerHeight

		const ctx = canvasRef.current.getContext('2d')
		if (!ctx) return

		let x = (canvasRef.current?.width as number) / 2
		let y = (canvasRef.current?.height as number) / 2

		const player = new Player(x, y, 10, 'white')

		setPlayer(player)
		setCtx(ctx)

		// BG
		for (let x = 0; x < canvasRef.current.width; x += 35) {
			for (let y = 0; y < canvasRef.current.height; y += 35) {
				gameState.setBackgroundParticles(prev => [
					...prev,
					new BackgroundParticle(x, y, 3, 'blue')
				])
			}
		}
	}, [])

	// game init state
	const gameState = useGameState(canvasRef, player)

	// Enemy spawning
	useEnemySpawner({
		canvasRef,
		isGameOver: gameState.isGameOver,
		setEnemys: gameState.setEnemys
	})

	// PowerUp spawning
	usePowerUpsSpawner({
		canvasRef,
		isGameOver: gameState.isGameOver,
		setPowerUps: gameState.setPowerUps
	})

	useGameAnimation({
		ctx,
		canvasRef,
		gameState,
		player,
		animationIdRef,
		animationEnemyIdRef
	})

	return (
		<>
			<GameStarted gameState={gameState} />
			<canvas
				ref={canvasRef}
				className='game-canvas'
				style={{ background: 'transparent' }}
			/>
		</>
	)
}

export default Game
