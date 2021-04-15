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
    XRegExp.forEach(text, /(\d{1,3},?\d{1,3},?\d{1,3})\s?(?=birr|Birr|BIRR|ብር)+/, (match) => {
        result.push(match[0]);
    });
    return result.map(formatPrice);
}