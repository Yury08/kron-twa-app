import default_icon from '../../public/coin_logo.svg'
import instagram_icon from '../../public/logo_instagram.svg'
import telegram_icon from '../../public/logo_telegram.svg'
import wallet_icon from '../../public/logo_wallet.svg'

export const TASK_ICONS = {
	wallet: wallet_icon,
	telegram: telegram_icon,
	instagram: instagram_icon,
	default: default_icon
} as const

export type TaskIconType = keyof typeof TASK_ICONS
