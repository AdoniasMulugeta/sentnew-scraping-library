const XRegExp =  require('xregexp');
const { formatPhone, formatPrice } = require("./formatter");

exports.extractPhone = (text) => {
    const result = [];
    XRegExp.forEach(text, /(?:251|0|)9[0-9]{8}/, (match) => {
        result.push(match[0]);
    });
    return result.map(formatPhone);
}

exports.extractPrice = (text) => {
    const result = [];
        XRegExp.forEach(text, /(\d{0,3},?\d{0,3},?\d{0,3})\.?\d+\s?(?=birr|Birr|BIRR|ብር)+/, (match) => {
        result.push(match[0]);
    });
    return result.map(formatPrice);
}
exports.filterUniqueMessages = (messages) => {
    const uniqueMessages = []
    messages.forEach((message) => {
        const duplicates = uniqueMessages.filter(unqMsg => (message.message === unqMsg.message));
        if(!duplicates.length) uniqueMessages.push(message);
    });
    return uniqueMessages;
}
exports.filterProducts = (messages) => {
    return messages.filter((message) => {
        return !!(message.price)
    });
}