import dotenv from 'dotenv'
import { Bot, InlineKeyboard } from 'grammy'

// Явно указываем путь к .env файлу
dotenv.config()

const BOT_TOKEN = process.env.BOT_TOKEN
const WEB_URL = process.env.WEB_URL
const CHANNEL_URL = process.env.CHANNEL_URL

if (!BOT_TOKEN) {
	throw new Error('BOT_TOKEN is not defined in environment variables')
}

if (!WEB_URL) {
	throw new Error('WEB_URL is not defined in environment variables')
}

if (!CHANNEL_URL) {
	throw new Error('CHANNEL_URL is not defined in environment variables')
}

const bot = new Bot(BOT_TOKEN)

// Добавляем обработчик ошибок
bot.catch(err => {
	console.error(`Error while handling update ${err.ctx?.update.update_id}:`)
	console.error(err.error)
})

// bot.api.setChatMenuButton({
// 	menu_button: {
// 		type: 'web_app',
// 		text: 'Open Kron',
// 		web_app: { url: WEB_URL },
// 	},
// })

bot.command('start', async ctx => {
	try {
		// Создаем клавиатуру с кнопкой для присоединения к каналу
		const keyboard = new InlineKeyboard()
			.url('Join Our Channel', CHANNEL_URL)
			.row()
			.webApp('Open Kron', WEB_URL)

		// Отправляем приветственное сообщение
		await ctx.reply(
			`👋 Welcome to Kron!

🚀At Kron, we’re building an exciting Play-to-Earn game on Telegram where you can have fun while earning crypto rewards! But this is just the beginning — there will be many cool updates coming soon, and we’ll reward our loyal players with gifts and bonuses!

🔹 What’s waiting for you in Kron right now?

🎮 Play and Earn – Dive into the game, complete challenges, and rack up Kron Points for future rewards!
🤝 Bring Your Friends – Share the fun! Invite others and boost your earnings together.
🏆 Take on Quests – Prove your skills, complete special tasks, and unlock even more prizes!

Big things are coming! Start playing now and get ready for exclusive NFTs, a native token launch, and even more ways to win! 🔥`,
			{
				reply_markup: keyboard,
			}
		)

		await ctx.api.setChatMenuButton({
			chat_id: ctx.chat.id,
			menu_button: {
				text: 'Open Kron',
				type: 'web_app',
				web_app: {
					url: WEB_URL,
				},
			},
		})
	} catch (error) {
		console.error('Error in start command:', error)
		console.log('WEB_URL:', WEB_URL) // Для отладки
		await ctx.reply('Sorry, something went wrong. Please try again later.')
	}
})

// Логируем конфигурацию при запуске
console.log('Bot is starting with following config:', {
	webUrl: WEB_URL,
	channelUrl: CHANNEL_URL,
})

bot.start()
