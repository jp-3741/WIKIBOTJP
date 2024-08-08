require('dotenv').config();
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Load environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatIds = process.env.TELEGRAM_CHAT_IDS.split(',');  // Split comma-separated chat IDs into an array

const bot = new TelegramBot(token, { polling: true });

// Log chat ID when a message is received
bot.on('message', (msg) => {
    console.log('Received message from chat ID:', msg.chat.id);  // This will log the chat ID
    bot.sendMessage(msg.chat.id, 'Chat ID logged.');  // Optional: Respond to the user
});

// Function to get a random Wikipedia article
async function getRandomWikiArticle() {
    try {
        const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
        const article = response.data;
        return {
            title: article.title,
            summary: article.extract,
            url: article.content_urls.desktop.page
        };
    } catch (error) {
        console.error('Error fetching Wikipedia article:', error.message);
        return null;
    }
}

// Function to send a message to multiple Telegram chats
async function sendTelegramMessage(text) {
    try {
        for (const chatId of chatIds) {
            await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
            console.log(`Message sent successfully to chat ID: ${chatId}`);
        }
    } catch (error) {
        console.error('Error sending message to Telegram:', error.response ? error.response.data : error.message);
    }
}

// Main function to fetch the article and post to Telegram
async function postRandomWikiArticleToTelegram() {
    const article = await getRandomWikiArticle();
    if (article) {
        const message = `*${article.title}*\n\n${article.summary}\n\n[Read more](${article.url})`;
        await sendTelegramMessage(message);
    } else {
        console.log('No article found to post.');
    }
}

// Post a random Wikipedia article to Telegram every 15 seconds
setInterval(postRandomWikiArticleToTelegram, 50 * 1000);

// Post the first article immediately when the script runs
postRandomWikiArticleToTelegram();
