const { pluck } = require('ramda')
const moment = require('moment');
const { inputField } = require('./utils/fixtures')
const config = require('./config')
const fetch = require("node-fetch")
const database = require('./utils/db');

const telegram = require('./utils/init')

const getChat = async () => {
    const dialogs = await telegram('messages.getDialogs', {
        limit: 100,
    })
    return dialogs.chats
}

const chatHistory = async (chat, { maxDate, minId, limit = 200 }) => {
    const params = {}
    params.peer = {
        _: 'inputPeerChannel',
        channel_id: chat.id,
        access_hash: chat.access_hash
    }
    params.limit = limit
    if (minId > 0) params.min_id = minId;
    else { maxDate = moment().subtract(1, 'month').unix(); }
    if (maxDate) params.offset_date = maxDate;

    let history = await telegram('messages.getHistory', params)
    return history.messages;
}

const printMessages = (messages) => {
    const formatted = messages.map(formatMessage)
    formatted.forEach(e => console.log(e))
}

const uniqueArray = function(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
const filterLastDay = ({ date }) => new Date(date * 1e3) > dayRange()
const dayRange = () => Date.now() - new Date(86400000 * 4)
const filterUsersMessages = ({ _ }) => _ === 'message'

const formatMessage = ({ message, date, id }) => {
    const dt = new Date(date * 1e3)
    const hours = dt.getHours()
    const mins = dt.getMinutes()
    return `${hours}:${mins} [${id}] ${message}`
}

const selectChat = async (chats) => {
    const chatNames = pluck('title', chats)
    console.log('Your chat list')
    chatNames.map((name, id) => console.log(`${id}  ${name}`))
    console.log('Select chat by index')
    const chatIndex = await inputField('index')
    return chats[+chatIndex]
}

module.exports = {
    fetchChats: getChat,
    chatHistory,
}
