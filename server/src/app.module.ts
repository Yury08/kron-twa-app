import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { FarmingModule } from './farming/farming.module'
import { FriendModule } from './friend/friend.module'
import { TasksModule } from './tasks/tasks.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		UserModule,
		ConfigModule.forRoot(),
		AuthModule,
		FriendModule,
		TasksModule,
		FarmingModule
	]
})
export class AppModule {}
