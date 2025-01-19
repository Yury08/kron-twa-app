import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Decimal } from 'decimal.js'
import Redis from 'ioredis'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class FarmingService {
	private countdown: number = 8 * 60 * 60 // 8 часов в миллисекундах
	constructor(
		@Inject('RedisClient') private readonly redisClient: Redis,
		private readonly prisma: PrismaService,
		private readonly userService: UserService
	) {}

	getTimerId(userId: string) {
		return this.prisma.farming.findFirst({
			where: {
				userId
			}
		})
	}

	async startFarming(userId: string, expiry: number) {
		const user = await this.userService.getById(userId)
		if (!user) throw new NotFoundException('User not found')
		await this.redisClient.set(`${userId}_isFarming`, 'true', 'EX', expiry)
		return this.prisma.farming.update({
			where: {
				id: (await this.getTimerId(userId)).id
			},
			data: {
				isCompleted: false,
				amount: new Decimal(this.countdown * 2).dividedBy(1000),
				totalSeconds: this.countdown
			}
		})
	}

	async getFarmingValue(userId: string) {
		await this.redisClient.set(`${userId}_isFarming`, 'false')
		const timer = await this.prisma.farming.findFirst({
			where: { userId }
		})

		if (!timer) {
			throw new Error('Timer not found for the user')
		}

		const balance = await this.userService.updateBalance(timer.amount, userId)
		const transformBalance = balance.balance.toString()
		await this.redisClient.set(`${userId}_balance`, transformBalance)

		await this.prisma.farming.update({
			where: {
				id: (await this.getTimerId(userId)).id
			},
			data: {
				isCompleted: true,
				totalSeconds: 0,
				amount: 0
			}
		})
	}

	async getBalance(userId: string) {
		const res = await this.redisClient.get(`${userId}_balance`)
		if (!res) {
			throw new Error('Balance not found in Redis')
		}
		return JSON.parse(res)
	}

	async getFarming(userId: string) {
		const farm = await this.redisClient.get(`${userId}_isFarming`)
		if (!farm) return false
		return JSON.parse(farm)
	}

	async getTtl(userId: string) {
		const res = await this.redisClient.ttl(`${userId}_isFarming`)
		return res
	}
}
