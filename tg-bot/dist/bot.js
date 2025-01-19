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
dotenv_1.default.config();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN || '');
bot.command('start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.setChatMenuButton({
        chat_id: ctx.chat.id,
        menu_button: {
            text: 'Открыть Mini App',
            type: 'web_app',
            web_app: {
                url: process.env.NGROK_URL || '',
            },
        },
    });
}));
bot.start();
