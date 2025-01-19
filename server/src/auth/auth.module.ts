import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FriendModule } from 'src/friend/friend.module'
import { PrismaService } from 'src/prisma.service'
import { TasksModule } from 'src/tasks/tasks.module'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [UserModule, FriendModule, ConfigModule, TasksModule],
	controllers: [AuthController],
	providers: [AuthService, PrismaService] // JwtStrategy
})
export class AuthModule {}
