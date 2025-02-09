"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const grammy_1 = require("grammy");
// Явно указываем путь к .env файлу
dotenv_1.default.config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_URL = process.env.WEB_URL;
const CHANNEL_URL = process.env.CHANNEL_URL;
if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN is not defined in environment variables');
}
if (!WEB_URL) {
    throw new Error('WEB_URL is not defined in environment variables');
}
if (!CHANNEL_URL) {
    throw new Error('CHANNEL_URL is not defined in environment variables');
}
const bot = new grammy_1.Bot(BOT_TOKEN);
// Добавляем обработчик ошибок
bot.catch(err => {
    var _a;
    console.error(`Error while handling update ${(_a = err.ctx) === null || _a === void 0 ? void 0 : _a.update.update_id}:`);
    console.error(err.error);
});
// bot.api.setChatMenuButton({
// 	menu_button: {
// 		type: 'web_app',
// 		text: 'Open Kron',
// 		web_app: { url: WEB_URL },
// 	},
// })
bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Создаем клавиатуру с кнопкой для присоединения к каналу
        const keyboard = new grammy_1.InlineKeyboard()
            .url('Join Our Channel', CHANNEL_URL)
            .row()
            .webApp('Open Kron', WEB_URL);
        // Отправляем приветственное сообщение
        yield ctx.reply(`👋 Welcome to Kron!

🚀At Kron, we’re building an exciting Play-to-Earn game on Telegram where you can have fun while earning crypto rewards! But this is just the beginning — there will be many cool updates coming soon, and we’ll reward our loyal players with gifts and bonuses!

🔹 What’s waiting for you in Kron right now?

🎮 Play and Earn – Dive into the game, complete challenges, and rack up Kron Points for future rewards!
🤝 Bring Your Friends – Share the fun! Invite others and boost your earnings together.
🏆 Take on Quests – Prove your skills, complete special tasks, and unlock even more prizes!

Big things are coming! Start playing now and get ready for exclusive NFTs, a native token launch, and even more ways to win! 🔥`, {
            reply_markup: keyboard,
        });
        yield ctx.api.setChatMenuButton({
            chat_id: ctx.chat.id,
            menu_button: {
                text: 'Open Kron',
                type: 'web_app',
                web_app: {
                    url: WEB_URL,
                },
            },
        });
    }
    catch (error) {
        console.error('Error in start command:', error);
        console.log('WEB_URL:', WEB_URL); // Для отладки
        yield ctx.reply('Sorry, something went wrong. Please try again later.');
    }
}));
// Логируем конфигурацию при запуске
console.log('Bot is starting with following config:', {
    webUrl: WEB_URL,
    channelUrl: CHANNEL_URL,
});
bot.start();
