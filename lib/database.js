const fs = require("fs");
const { Schema, model, Types, connect } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const config = require('../config');
const Mapper = require('../utils/mapper');

const DBFILE = config.dbfile;
const CHATDB = config.chatdb;
const messagesMapper = new Mapper()
const chatsMapper = new Mapper()

exports.connect = async () => {
    await connect(config.mongoDBURL, {
        autoReconnect: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    });
}
const messageSchema = new Schema({
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
}, { timestamps: true });
messageSchema.plugin(mongoosePaginate);
// Exposing message model to other scripts
const messageModel = model('message', messageSchema);

// Exposing message model to other scripts
const productModel = model('product', new Schema({
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

exports.saveMessages = async (data) => {
    let messageData = await messageModel.insertMany(data, { ordered: false });
    return messagesMapper.map(messageData);
}
exports.getChats = async (query = {}) => {
    let chats = await chatModel.find(query);
    return chatsMapper.map(chats);
}
exports.saveChats = async (data) => {
    let chats = await chatModel.insertMany(data, { ordered: false });
    return chatsMapper.map(chats);
}
exports.readDb = async (file) => {
    return new Promise((res, rej) => {
        fs.readFile(file, 'utf8', (err, data) => {
            err ? rej(err) : res(data)
        });
    })
}

exports.writeFile = async (json, file) => {
    return new Promise((res, rej) => {
        fs.writeFile(file, JSON.stringify(json, null, 2), "utf8", (err) => {
            err ? rej(err) : res();
        });
    })
}

exports.updateLastMsgId = async (num) => {
    try {
        const work = await writeFile({
            lastMsgId: num
        }, DBFILE)
    } catch (err) {
        console.log("error, couldnt save to file " + err)
    }
}

exports.getLastMessage = async (query) => {
    const messages = await messageModel.find(query).sort({ id: -1 }).limit(1);
    return messages[0] || { id: 0 };
}

exports.getChat = async () => {
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

exports.updateChat = async (obj) => {
    try {
        const work = await writeFile({
            chat: obj
        }, CHATDB)
    } catch (err) {
        console.log("error, couldnt save chat to file " + err)
    }
}

exports.getMessages = async (query = {}, options) => {
    return messageModel.paginate(query, options);
}
exports.saveFormattedMessages = async (data) => {
    return messageModel.find(query).sort({createdAt: 1})
}
