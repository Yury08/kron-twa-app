import Player from './Player'

// враги
export default class Enemy {
	type: string
	center: { x: number; y: number }
	radians: number
	constructor(
		public x: number,
		public y: number,
		public radius: number,
		public color: string,
		public velocity: { x: number; y: number }
	) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.type = 'linear'
		this.center = {
			x,
			y
		}
		this.radians = 0

		if (Math.random() < 0.25) {
			this.type = 'homing'

			if (Math.random() < 0.5) {
				this.type = 'spinning'

				if (Math.random() < 0.75) {
					this.type = 'homingSpinning'
				}
			}
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fillStyle = this.color
		ctx.fill()
	}

	update(ctx: CanvasRenderingContext2D, player: Player) {
		this.draw(ctx)
		if (this.type === 'linear') {
			this.x = this.x + this.velocity.x
			this.y = this.y + this.velocity.y
		} else if (this.type === 'homing') {
			const angle = Math.atan2(player.y - this.y, player.x - this.x)

			this.velocity = {
				x: Math.cos(angle),
				y: Math.sin(angle)
			}

			this.x = this.x + this.velocity.x
			this.y = this.y + this.velocity.y
		} else if (this.type === 'spinning') {
			this.radians += 0.05
			this.center.x += this.velocity.x
			this.center.y += this.velocity.y

			this.x = this.center.x + Math.cos(this.radians) * 100
			this.y = this.center.y + Math.sin(this.radians) * 100
		} else if (this.type === 'homingSpinning') {
			const angle = Math.atan2(player.y - this.y, player.x - this.x)

			this.velocity = {
				x: Math.cos(angle),
				y: Math.sin(angle)
			}

			this.radians += 0.05
			this.center.x += this.velocity.x
			this.center.y += this.velocity.y

			this.x = this.center.x + Math.cos(this.radians) * 100
			this.y = this.center.y + Math.sin(this.radians) * 100
		}
	}
}
