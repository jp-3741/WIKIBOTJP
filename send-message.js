require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token);

bot.sendMessage(chatId, 'Test message to verify chat ID', { parse_mode: 'Markdown' })
    .then(() => console.log('Test message sent successfully'))
    .catch((error) => {
        if (error.response) {
            console.error('Error sending message:', error.response.data);
        } else {
            console.error('Error sending message:', error.message);
        }
    });
