//module bot.js

const TelegramBotClient = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config({ silent: true })

const bot = new TelegramBotClient(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello World!!!');
});