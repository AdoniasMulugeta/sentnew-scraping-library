console.log = (toLog) => {
    if (toLog.message) console.info(toLog.message);
    console.info(toLog);
};
console.error = (toLog) => {
    if (toLog.message) console.info(toLog.message);
    console.info(toLog);
}

const mongoose = require('mongoose');
const telegram = require('./chat-history')
const database = require('./utils/db');
const {checkLogin} = require('./utils/node-storage');
const config = require('./config');
const { pause } = require('./utils/async');

const getMessages = async (chat) => {
    if (!chat || !chat.id || !chat.access_hash) return;
    let messages = []
    // console.info('\nGetting messages for chat', chat.id)
    const lastMessage = await database.getLastMessage({ chatId: chat._id })
    // console.info(`Getting messages starting from id: ${lastMessage.id}`)
    messages = await telegram.chatHistory(chat, { minId: lastMessage.id });
    if (messages.length){
        messages = messages.map((message) => ({ chatId: chat._id ,...message}));
        await database.saveMessages(messages);
        console.info(`\nSaved ${messages.length} messages for chat ${chat.title || chat.username}.\nFrom ${messages[messages.length - 1].id} to ${messages[0].id}`)
    } else {
        console.info(`No messages for chat ${chat.id}, moving on to next chat`)
    }
}

const start = async () => {
    console.info(`
 +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+
 |t|e|l|e|g|r|a|m| |s|c|r|a|p|e|r|
 +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+
`)
    await checkLogin();
    let chats = await database.getChats();
    if (!chats.length) {
        chats = await telegram.fetchChats();
        chats = await database.saveChats(chats);
    }
    while (true){
        for (let i = 0; i < chats.length; i++) {
            getMessages(chats[i]);
            await pause(5000);
        }
        await pause(100000)
    }
}

mongoose.connect(config.mongoDBURL, {
    autoReconnect: true,
    useNewUrlParser: true,
    useFindAndModify: false,
}).then(start).catch((error) => { console.error(error.message) });

process.on('unhandledRejection', (error) => {
    if(error) console.error(error.message);
})
