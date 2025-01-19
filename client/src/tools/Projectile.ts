// снаряды
export default class Projectile {
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
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
		ctx.fillStyle = this.color
		ctx.fill()
		ctx.closePath()
	}

	update(ctx: CanvasRenderingContext2D) {
		this.draw(ctx)
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}
