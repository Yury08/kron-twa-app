import BackgroundParticle from '@/tools/BackgroundParticle'
import Enemy from '@/tools/Enemy'
import Particle from '@/tools/Particle'
import Player from '@/tools/Player'
import PowerUp from '@/tools/PowerUp'
import Projectile from '@/tools/Projectile'

export interface UseGameAnimationProps {
	ctx: CanvasRenderingContext2D | undefined
	canvasRef: React.RefObject<HTMLCanvasElement>
	gameState: GameState
	player: Player | undefined
	animationIdRef: React.MutableRefObject<number | undefined>
	animationEnemyIdRef: React.MutableRefObject<number | undefined>
}

export interface UseEnemySpawnerProps {
	canvasRef: React.RefObject<HTMLCanvasElement>
	isGameOver: boolean
	setEnemys: (callback: (prev: Enemy[]) => Enemy[]) => void
}

export interface UsePowerUpsSpawnerProps {
	canvasRef: React.RefObject<HTMLCanvasElement>
	isGameOver: boolean
	setPowerUps: (callback: (prev: PowerUp[]) => PowerUp[]) => void
}

export type Mouse = {
	down: boolean
	x: number | undefined
	y: number | undefined
}

export interface GameState {
	mouse: Mouse
	projectiles: Projectile[]
	setProjectiles: React.Dispatch<React.SetStateAction<Projectile[]>>
	particles: Particle[]
	setParticles: React.Dispatch<React.SetStateAction<Particle[]>>
	enemys: Enemy[]
	setEnemys: React.Dispatch<React.SetStateAction<Enemy[]>>
	powerUps: PowerUp[]
	setPowerUps: React.Dispatch<React.SetStateAction<PowerUp[]>>
	isGameOver: boolean
	setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>
	isGameStarted: boolean
	scoreEl: number
	setScoreEl: React.Dispatch<React.SetStateAction<number>>
	startGame: () => void
	backgroundParticles: BackgroundParticle[]
	setBackgroundParticles: React.Dispatch<
		React.SetStateAction<BackgroundParticle[]>
	>
}

export interface Star {
	x: number
	y: number
	radius: number
	alpha: number
	velocity: number
}
