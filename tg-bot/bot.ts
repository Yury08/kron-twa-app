import dotenv from 'dotenv'
import { Bot } from 'grammy'

dotenv.config()

const bot = new Bot(process.env.BOT_TOKEN || '')

bot.command('start', async ctx => {
	await bot.api.setChatMenuButton({
		chat_id: ctx.chat.id,
		menu_button: {
			text: 'Открыть Mini App',
			type: 'web_app',
			web_app: {
				url: process.env.NGROK_URL || '',
			},
		},
	})
})

bot.start()
