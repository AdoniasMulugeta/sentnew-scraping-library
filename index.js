const { MTProto } = require('@mtproto/core');
const { tempLocalStorage } = require('@mtproto/core/src/storage/temp');

const api_id = '';
const api_hash = '';

// 1. Create an instance
const mtproto = new MTProto({ api_id, api_hash, tempLocalStorage, test: true });

const user = mtproto.call('users.getFullUser', { id: { _: 'inputUserSelf' } }).then((user) => {
    console.log(user);
}).catch(console.log);;

mtproto.call('contacts.resolveUsername', { username: '@tikvahethiopia' }).then(result => {
    console.log(`country:`, result);
}).catch(console.log);

api.call('auth.sendCode', { phone_number: phone, settings: { _: 'codeSettings' } });