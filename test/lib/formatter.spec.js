const { expect } = require('chai');
const formatter = require('../../lib/formatter');

describe('Formatter Module Tests', () => {
    describe('formatPhone function tests', () => {
        it('should return a Telegram class instance', async () => {
            expect(formatter.formatPhone(`0904654449`)).to.eql('+251904654449');
            expect(formatter.formatPhone(`904654449`)).to.eql('+251904654449');
            expect(formatter.formatPhone(`251904654449`)).to.eql('+251904654449');
            expect(formatter.formatPhone(`+251904654449`)).to.eql('+251904654449');
            expect(formatter.formatPhone(`91234992`)).to.eql(null);
        });
    });
    describe('pricePhone function tests', () => {
        it('should return a Telegram class instance', async () => {
            expect(formatter.formatPrice('123')).to.eql(123);
            expect(formatter.formatPrice(123)).to.eql(123);
            expect(formatter.formatPrice('123.45')).to.eql(123.45);
        });
    });
});