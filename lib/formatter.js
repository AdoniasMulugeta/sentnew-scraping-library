const { parsePhoneNumber, isValidNumberForRegion  } = require('libphonenumber-js');

exports.formatPhone = (phone) => {
    if (!isValidNumberForRegion(phone, 'ET')) return null;
    const parsedPhone = parsePhoneNumber(phone, 'ET');
    return parsedPhone.number
}
exports.formatPrice = (price) => {
    return parseFloat(price.toString().replace(',', ''));
}
exports.formatMessages = (messages) => {
    return messages.map((message) => ({
        messageId: message._id,
        telegramMessageId: message.id,
        telegramChatId: message.chatId,
        date: message.date,
        message: message.message || (message.media ? message.media.caption : ""),
        photo: message.photo,
    }));
}