const { expect } = require('chai');
const parser = require('../../lib/parser');

describe('Index Tests', () => {
    describe('extractPhone function tests', () => {
        it('should return a Telegram class instance', async () => {
            expect(parser.extractPhone(`Call on 0904654449`)).to.eql(['+251904654449']);
            expect(parser.extractPhone(`Call on 904654449`)).to.eql(['+251904654449']);
            expect(parser.extractPhone(`Call on 251904654449 `)).to.eql(['+251904654449']);
            expect(parser.extractPhone(`093836109 ይደውሉ`)).to.eql([]);
            expect(parser.extractPhone(`0938361091 ይደውሉ 0904654449`)).to.eql(['+251938361091', '+251904654449']);
        });
    });
    describe('extractPrice function tests', () => {
        it('should return a Telegram class instance', async () => {
            expect(parser.extractPrice(`2500 birr`)).to.eql([2500]);
            expect(parser.extractPrice(`30 birr`)).to.eql([30]);
            expect(parser.extractPrice(`2500birr`)).to.eql([2500]);
            expect(parser.extractPrice(`2500.00 birr`)).to.eql([2500]);
            expect(parser.extractPrice(`💵 1,500 ብር ብቻ 😮`)).to.eql([1500]);
            expect(parser.extractPrice(`2000`)).to.eql([]);
            expect(parser.extractPrice(`Call on 904654449`)).to.eql([]);
            expect(parser.extractPrice(`#ዋጋ - 4799 ብር ብቻ / 399 birr`)).to.eql([4799, 399]);
        });
    });
});