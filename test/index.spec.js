const { expect } = require('chai');
const {processMessages} = require('../index');
const fixture = require('./fixture');

describe('Index Tests', () => {
    describe('processMessages function tests', () => {
        it('should an array of processed messages', async () => {
            const result = processMessages(fixture.messages);
            expect(result).to.be.an('array');
            expect(result[0].price).to.exist;
            expect(result[0].price).to.eql('4799')
        });
    });
});