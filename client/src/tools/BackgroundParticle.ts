export default class BackgroundParticle {
	x: number
	y: number
	radius: number
	color: string
	alpha: number
	initialAlpha: number
	constructor(x: number, y: number, radius: number, color: string) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.alpha = 0.05
		this.initialAlpha = this.alpha
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
		// this.alpha -= 0.01
	}
}
