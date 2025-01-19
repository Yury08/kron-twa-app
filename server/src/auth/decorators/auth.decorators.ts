import { UseGuards } from '@nestjs/common'
import { TelegramGuard } from '../guards/telegram.guard'

export const Auth = () => UseGuards(TelegramGuard)
