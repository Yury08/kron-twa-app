import Projectile from './Projectile'

export default class Player {
	x: number
	y: number
	radius: number
	color: string
	velocity: { x: number; y: number }
	friction: number
	powerUp: string | null
	lastShotTime?: number = undefined

	constructor(x: number, y: number, radius: number, color: string) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = {
			x: 0,
			y: 0
		}
		this.friction = 0.99
		this.powerUp = ''
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fillStyle = this.color
		ctx.fill()
	}

	update(
		ctx: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number
	) {
		this.draw(ctx)
		this.velocity.x *= this.friction
		this.velocity.y *= this.friction

		// Обновление позиции по оси X
		if (this.x - this.radius + this.velocity.x < 0) {
			this.x = this.radius // Устанавливаем на границу
			this.velocity.x = 0 // Обнуляем скорость
		} else if (this.x + this.radius + this.velocity.x > canvasWidth) {
			this.x = canvasWidth - this.radius // Устанавливаем на границу
			this.velocity.x = 0 // Обнуляем скорость
		} else {
			this.x += this.velocity.x // Обновляем позицию
		}

		// Обновление позиции по оси Y
		if (this.y - this.radius + this.velocity.y < 0) {
			this.y = this.radius // Устанавливаем на границу
			this.velocity.y = 0 // Обнуляем скорость
		} else if (this.y + this.radius + this.velocity.y > canvasHeight) {
			this.y = canvasHeight - this.radius // Устанавливаем на границу
			this.velocity.y = 0 // Обнуляем скорость
		} else {
			this.y += this.velocity.y // Обновляем позицию
		}
		// if (
		// 	this.x - this.radius + this.velocity.x > 0 &&
		// 	this.x + this.radius + this.velocity.x < canvasWidth
		// ) {
		// 	this.x = this.x + this.velocity.x
		// } else {
		// 	this.velocity.x = 0
		// }

		// if (
		// 	this.y - this.radius + this.velocity.y > 0 &&
		// 	this.y + this.radius + this.velocity.y < canvasHeight
		// ) {
		// 	this.y = this.y + this.velocity.y
		// } else {
		// 	this.velocity.y = 0
		// }
		// this.x = this.x + this.velocity.x
		// this.y = this.y + this.velocity.y
	}

	shoot(
		mouse: { down: boolean; x: number | undefined; y: number | undefined },
		color = 'white',
		setProjectiles: any,
		speed = 3
	) {
		if (mouse.x && mouse.y) {
			const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x)
			const velocity = {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed
			}
			setProjectiles((prev: any) => [
				...prev,
				new Projectile(this.x, this.y, 5, color, velocity)
			])
		}
	}
}
