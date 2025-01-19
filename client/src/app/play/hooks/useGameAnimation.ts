import gsap from 'gsap'
import { useEffect } from 'react'

import { UseGameAnimationProps } from '@/types/game.types'

import BackgroundParticle from '@/tools/BackgroundParticle'
import Enemy from '@/tools/Enemy'
import Particle from '@/tools/Particle'
import PowerUp from '@/tools/PowerUp'
import Projectile from '@/tools/Projectile'

export const useGameAnimation = ({
	ctx,
	canvasRef,
	gameState,
	player,
	animationIdRef
}: UseGameAnimationProps) => {
	useEffect(() => {
		if (
			!gameState.isGameStarted ||
			gameState.isGameOver ||
			!ctx ||
			!canvasRef.current ||
			!player
		)
			return
		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			const { keyCode } = event
			if (keyCode === 87) {
				player.velocity.y -= 0.8
			} else if (keyCode === 65) {
				player.velocity.x -= 0.8
			} else if (keyCode === 83) {
				player.velocity.y += 0.8
			} else if (keyCode === 68) {
				player.velocity.x += 0.8
			}

			switch (keyCode) {
				case 37:
					player.velocity.x -= 0.8
					break
				case 40:
					player.velocity.y += 0.8
					break
				case 39:
					player.velocity.x += 0.8
					break
				case 38:
					player.velocity.y -= 0.8
					break
			}
		}
		const handleMouseDown = ({ clientX, clientY }: MouseEvent) => {
			gameState.mouse.x = clientX
			gameState.mouse.y = clientY
			gameState.mouse.down = true
		}

		const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
			gameState.mouse.x = clientX
			gameState.mouse.y = clientY
		}

		const handleMouseUp = () => {
			gameState.mouse.down = false
		}

		const handleClick = (event: MouseEvent) => {
			if (player.powerUp !== 'Automatic') {
				gameState.mouse.x = event.clientX
				gameState.mouse.y = event.clientY
				player.shoot(gameState.mouse, 'white', gameState.setProjectiles)
			}
		}

		const handleTouchStart = (event: TouchEvent) => {
			gameState.mouse.x = event.touches[0].clientX
			gameState.mouse.y = event.touches[0].clientY
			gameState.mouse.down = true
		}

		const handleTouchMove = (event: TouchEvent) => {
			gameState.mouse.x = event.touches[0].clientX
			gameState.mouse.y = event.touches[0].clientY
		}

		const handleTouchEnd = () => {
			gameState.mouse.down = false
		}

		const handleResize = () => {
			if (canvasRef.current) {
				canvasRef.current.width = window.innerWidth
				canvasRef.current.height = window.innerHeight
			}
		}
		function animate() {
			if (!player) return
			if (!gameState.isGameOver) {
				animationIdRef.current = requestAnimationFrame(animate)
			}
			if (!ctx || !canvasRef.current || !gameState.enemys) return

			// Очищаем только текущий кадр, сохраняя прозрачность
			// ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
			ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
			ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

			gameState.backgroundParticles.forEach(
				(backgroundParticle: BackgroundParticle) => {
					const dist = Math.hypot(
						player.x - backgroundParticle.x,
						player.y - backgroundParticle.y
					)

					const hideRadius = 100
					if (dist < hideRadius) {
						if (dist < 70) {
							backgroundParticle.alpha = 0
						} else {
							backgroundParticle.alpha = 0.5
						}
					} else if (
						dist >= hideRadius &&
						backgroundParticle.alpha < backgroundParticle.initialAlpha
					) {
						backgroundParticle.alpha += 0.01
					} else if (
						dist >= hideRadius &&
						backgroundParticle.alpha > backgroundParticle.initialAlpha
					) {
						backgroundParticle.alpha -= 0.01
					}

					backgroundParticle.update(ctx)
				}
			)

			player.update(ctx, canvasRef.current.width, canvasRef.current.height)

			// Обновляем и рисуем частицы
			gameState.particles.forEach((particle: Particle, index: number) => {
				if (particle.alpha <= 0) {
					gameState.setParticles((prev: any[]) =>
						prev.filter((_, i) => i !== index)
					)
				} else {
					particle.update(ctx)
				}
			})

			if (player.powerUp === 'Automatic') {
				const currentTime = Date.now()
				if (!player.lastShotTime || currentTime - player.lastShotTime > 70) {
					player.shoot(gameState.mouse, '#8a00f6', gameState.setProjectiles, 5)
					player.lastShotTime = currentTime
				}
			}

			// power up
			gameState.powerUps.forEach((powerUp: PowerUp, index: number) => {
				const dist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y)

				// obtain power up
				// gain the automatic shooting ability
				if (dist - player.radius - powerUp.width / 2 < 1) {
					player.color = '#8a00f6'
					player.powerUp = 'Automatic'
					gameState.setPowerUps((prev: any[]) =>
						prev.filter((_, i) => i !== index)
					)

					setTimeout(() => {
						player.powerUp = null
						player.color = '#FFFFFF'
					}, 5000)
				} else {
					powerUp.update(ctx)
				}
			})

			// Обновляем и рисуем снаряды
			gameState.projectiles.forEach((projectile: Projectile, index: number) => {
				projectile.update(ctx)

				if (
					projectile.x + projectile.radius < 0 ||
					projectile.x - projectile.radius > canvasRef.current!.width ||
					projectile.y + projectile.radius < 0 ||
					projectile.y - projectile.radius > canvasRef.current!.height
				) {
					gameState.setProjectiles((prev: any[]) =>
						prev.filter((_, i) => i !== index)
					)
				}
			})

			// Обновляем и рисуем врагов
			gameState.enemys.forEach((enemy: Enemy, index: number) => {
				enemy.update(ctx, player)

				const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

				if (dist - enemy.radius - player.radius < 1) {
					gameState.setIsGameOver(true)
					return
				}

				gameState.projectiles.forEach(
					(projectile: Projectile, projectileIndex: number) => {
						const dist = Math.hypot(
							projectile.x - enemy.x,
							projectile.y - enemy.y
						)

						if (dist - enemy.radius - projectile.radius < 1) {
							// Создаем частицы при попадании
							for (let i = 0; i < enemy.radius * 2; i++) {
								gameState.setParticles((prev: any) => [
									...prev,
									new Particle(
										projectile.x,
										projectile.y,
										Math.random() * 2,
										enemy.color,
										{
											x: (Math.random() - 0.5) * (Math.random() * 4),
											y: (Math.random() - 0.5) * (Math.random() * 4)
										}
									)
								])
							}

							if (enemy.radius - 10 > 5) {
								gameState.setScoreEl((prev: number) => prev + 1)
								gsap.to(enemy, {
									radius: enemy.radius - 10
								})
								gameState.setProjectiles((prev: any[]) =>
									prev.filter((_, i) => i !== projectileIndex)
								)
							} else {
								gameState.setScoreEl((prev: number) => prev + 3)
								gameState.setEnemys((prev: any[]) =>
									prev.filter((_, i) => i !== index)
								)
								gameState.setProjectiles((prev: any[]) =>
									prev.filter((_, i) => i !== projectileIndex)
								)

								// change backgroundParticle colors
								gameState.backgroundParticles.forEach(
									(backgroundParticle: BackgroundParticle) => {
										backgroundParticle.color = enemy.color
										gsap.to(backgroundParticle, {
											alpha: 0.5,
											duration: 0.015,
											onComplete: () => {
												gsap.to(backgroundParticle, {
													alpha: backgroundParticle.initialAlpha,
													duration: 0.03
												})
											}
										})
									}
								)
							}
						}
					}
				)
			})
		}

		window.addEventListener('click', handleClick)
		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('mousedown', handleMouseDown)
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		window.addEventListener('touchstart', handleTouchStart)
		window.addEventListener('touchmove', handleTouchMove)
		window.addEventListener('touchend', handleTouchEnd)
		window.addEventListener('resize', handleResize)
		animate()

		return () => {
			window.removeEventListener('click', handleClick)
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('mousedown', handleMouseDown)
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
			window.removeEventListener('touchstart', handleTouchStart)
			window.removeEventListener('touchmove', handleTouchMove)
			window.removeEventListener('touchend', handleTouchEnd)
			window.removeEventListener('resize', handleResize)

			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current)
			}
		}
	}, [
		ctx,
		gameState.isGameOver,
		gameState.isGameStarted,
		gameState.projectiles,
		gameState.powerUps,
		gameState.enemys
	])
}
