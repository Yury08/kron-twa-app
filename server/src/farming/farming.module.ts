import { Module } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'
import { redisClientFactory } from 'src/redis/redis.client.factory'
import { UserService } from 'src/user/user.service'
import { FarmingController } from './farming.controller'
import { FarmingService } from './farming.service'

@Module({
	controllers: [FarmingController],
	providers: [FarmingService, PrismaService, UserService, redisClientFactory],
	exports: [FarmingService]
})
export class FarmingModule {}
