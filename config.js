require('dotenv').config();

const config = {
    telegram: {
        id: process.env.TELEGRAM_APP_ID,
        hash: process.env.TELEGRAM_APP_HASH,
        phone: process.env.TELEGRAM_PHONE_NUMBER,
        storage: process.env.TELEGRAM_FILE,
        devServer: false,
        msgHistory: {
            maxMsg: 200,
            limit: 100,
        },
        getChat: {
            limit: 50
        },
    },
    dbfile: process.env.DB_FILE,
    chatdb: process.env.CHAR_FILE,
    server: process.env.SERVER_URL,
    mongoDBURL: process.env.MONGODB_URL || 'mongodb://localhost/telegram-chat-scraper',
}

module.exports = config;