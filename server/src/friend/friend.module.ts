import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { FriendController } from './friend.controller'
import { FriendService } from './friend.service'

@Module({
	controllers: [FriendController],
	providers: [FriendService, PrismaService, UserService],
	exports: [FriendService]
})
export class FriendModule {}
