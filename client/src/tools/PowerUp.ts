let powerUpImg: HTMLImageElement

if (typeof window !== 'undefined') {
	powerUpImg = new Image()
	powerUpImg.src = '/lightning.png'
}

export default class PowerUp {
	width: number
	height: number
	radians: number
	constructor(
		public x: number,
		public y: number,
		public velocity: { x: number; y: number }
	) {
		this.x = x
		this.y = y
		this.velocity = velocity
		this.width = 14
		this.height = 18
		this.radians = 0
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
		ctx.rotate(this.radians)
		ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2)
		ctx.drawImage(powerUpImg, this.x, this.y, 14, 18)
		ctx.restore()
	}

	update(ctx: CanvasRenderingContext2D) {
		this.radians += 0.002
		this.draw(ctx)
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}
