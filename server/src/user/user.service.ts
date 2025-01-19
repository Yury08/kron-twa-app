import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Decimal } from 'decimal.js'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { MenuDto } from './dto/menu.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	private generateReferralLink(username: string) {
		return `https://t.me/${process.env.BOT_URL}?startapp=${username}?referral=${username}`
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			}
		})
	}

	async getByUsername(username: string) {
		return this.prisma.user.findUnique({
			where: {
				username
			}
		})
	}

	async getByTgUsername(tgUsername: string) {
		return this.prisma.user.findUnique({
			where: {
				tgUsername
			}
		})
	}

	async create(dto: AuthDto) {
		const user = {
			username: dto.username,
			tgUsername: dto.tgUsername,
			role: dto.role,
			referralLink: this.generateReferralLink(dto.username)
		}
		return this.prisma.user.create({
			data: user
		})
	}

	async updateBalance(quantity: Prisma.Decimal, userId: string) {
		const balance = (await this.getById(userId)).balance.plus(
			new Decimal(quantity)
		)
		return await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				balance
			}
		})
	}

	async updateTickets(userId: string, quantity: number = 3) {
		const tickets = (await this.getById(userId)).tickets + quantity
		return await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				tickets
			}
		})
	}

	async reducingTickets(userId: string, quantity: number = 1) {
		const userTickets = (await this.getById(userId)).tickets
		if (userTickets <= 0) return 'There are not enough tickets'
		const tickets = userTickets - quantity
		return await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				tickets
			}
		})
	}

	// menu (only admin users)
	async createMenu(dto: MenuDto) {
		return await this.prisma.menu.create({
			data: {
				title: dto.title,
				link: dto.title,
				icon: dto.icon
			}
		})
	}

	async getAllMenu() {
		return await this.prisma.menu.findMany()
	}

	async updateMenu(dto: MenuDto, menuId: string) {
		return await this.prisma.menu.update({
			where: {
				id: menuId
			},
			data: dto
		})
	}
}
