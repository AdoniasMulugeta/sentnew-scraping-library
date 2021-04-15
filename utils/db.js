const fs = require("fs");
const { Schema, model, Types } = require('mongoose');
const config = require('../config');
const Mapper = require('../utils/mapper');

const DBFILE = config.dbfile;
const CHATDB = config.chatdb;
const messagesMapper = new Mapper()
const chatsMapper = new Mapper()

// Exposing message model to other scripts
const messageModel = model('message', new Schema({
    flags: String,
    id: { required: true, type: Number, unique: true },
    from_id: Number,
    to_id: Object,
    fwd_from: Object,
    date: Number,
    message: String,
    media: Object,
    entities: Array,
    views: Number,
    chatId: { type: Types.ObjectId, required: true, ref: 'chat' }
}, { timestamps: true }));

const chatModel = model('chat', new Schema({
    id: { required: true, type: Number, unique: true },
    flags: Number,
    megagroup: Boolean,
    democracy: Object,
    access_hash: String,
    title: String,
    username: String,
    photo: {
        photo_small: {
            dc_id: Number,
            volume_id: String,
            local_id: Number,
            secret: String,
        },
        photo_big: {
            dc_id: Number,
            volume_id: String,
            local_id: Number,
            secret: String,
        }
    },
    date: Number,
    version: Number,
}, { timestamps: true }));

async function saveMessages(data) {
    let messageData = await messageModel.insertMany(data, { ordered: false });
    return messagesMapper.map(messageData);
}
async function getChats(query = {}) {
    let chats = await chatModel.find(query);
    return chatsMapper.map(chats);
}
async function saveChats(data) {
    let chats = await chatModel.insertMany(data, { ordered: false });
    return chatsMapper.map(chats);
}
async function readDb(file) {
    return new Promise((res, rej) => {
        fs.readFile(file, 'utf8', (err, data) => {
            err ? rej(err) : res(data)
        });
    })
}

async function writeFile(json, file) {
    return new Promise((res, rej) => {
        fs.writeFile(file, JSON.stringify(json, null, 2), "utf8", (err) => {
            err ? rej(err) : res();
        });
    })
}

async function updateLastMsgId(num) {
    try {
        const work = await writeFile({
            lastMsgId: num
        }, DBFILE)
    } catch (err) {
        console.log("error, couldnt save to file " + err)
    }
}

async function getLastMessage(query) {
    const messages = await messageModel.find(query).sort({ id: -1 }).limit(1);
    return messages[0] || { id: 0 };
}

async function getChat() {
    try {
        // todo check chat.json exists and create if not
        const readFile = await readDb(CHATDB);
        const file = JSON.parse(readFile)
        return file.chat;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function updateChat(obj) {
    try {
        const work = await writeFile({
            chat: obj
        }, CHATDB)
    } catch (err) {
        console.log("error, couldnt save chat to file " + err)
    }
}

module.exports = { updateLastMsgId, getLastMessage, getChat, getChats, updateChat, saveMessages, saveChats }