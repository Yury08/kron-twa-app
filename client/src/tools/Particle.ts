// Частицы при взрыве снаряда
const friction = 0.99
export default class Enemy {
	alpha: number
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
		this.alpha = 1
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.globalAlpha = this.alpha
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fillStyle = this.color
		ctx.fill()
		ctx.restore()
	}

	update(ctx: CanvasRenderingContext2D) {
		this.draw(ctx)
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha -= 0.01
	}
}
