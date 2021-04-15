const telegram = require('./lib/telegram')
const database = require('./lib/database');
const { pause } = require('./utils/async');
const { checkLogin } = require('./utils/node-storage');
const parser = require('./lib/parser');
const arrayUtil = require('./utils/array');
const formatter = require('./lib/formatter');

const scrapeMessages = async (chat) => {
    if (!chat || !chat.id || !chat.access_hash) return;
    // get last message scrapped for this chat. returns 0 if none exists
    const lastMessage = await database.getLastMessage({ chatId: chat._id })
    // fetch 100 messages from telegram
    let messages = await telegram.fetchMessages(chat, { minId: lastMessage.id });
    // if messages save to database
    if (messages.length){
        messages = messages.map((message) => ({ chatId: chat._id ,...message}));
        await database.saveMessages(messages);
        console.info(`\nSaved ${messages.length} messages for chat ${chat.title || chat.username}.\nFrom ${messages[messages.length - 1].id} to ${messages[0].id}`)
    } else {
        console.info(`No messages for chat ${chat.id}, moving on to next chat`)
    }
}

const start = async () => {
    await checkLogin();
    // scrapeChats();
    const options = {
        page: 1,
        limit: 100,
    }
    let messages;
    do {
        messages = await database.getMessages({}, options);
        options.page = messages.nextPage;
        const products = this.processMessages(messages.docs);
    } while (messages.hasNextPage)
}

const scrapeChats = async () => {
    // get all chats
    let chats = await database.getChats();
    // if there are no chats fetch chats from telegram
    if (!chats.length) {
        chats = await telegram.fetchChats();
        chats = await database.saveChats(chats);
    }
    // noinspection InfiniteLoopJS
    while (true){
        for (let i = 0; i < chats.length; i++) {
            scrapeMessages(chats[i]);
            await pause(5000);
        }
        await pause(100000)
    }
}

exports.processMessages = (messages) => {
    messages = formatter.formatMessages(messages);
    messages = parser.filterUniqueMessages(messages);
    messages = messages.map((message) => {
        const phone = parser.extractPhone(message.message)
        const price = parser.extractPrice(message.message);
        return {
            phone: phone.length ? phone[0] : null,
            price: price.length ? price[0] : null,
            ...message
        }
    });
    messages = parser.filterProducts(messages);
    return messages;
}

const filterDuplicate = (message) => {

    return !!messages.length
}

database.connect().then(start);

process.on('unhandledRejection', (error) => {
    if(error) console.error(error.message);
})
