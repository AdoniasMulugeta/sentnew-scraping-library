const moment = require('moment');
const telegramClient = require('../utils/init')

exports.fetchChats = async () => {
    const dialogs = await telegramClient('messages.getDialogs', {
        limit: 200,
    })
    return dialogs.chats
}

exports.fetchMessages = async (chat, { maxDate, minId, limit = 200 }) => {
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

    let history = await telegramClient('messages.getHistory', params)
    return history.messages;
}