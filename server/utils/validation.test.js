const {isRealString} = require('./validation');

describe('isRealString', () => {

    it('should reject non-string values', () => {
        expect(isRealString(1)).toBeFalsy();
    });

    it('should reject string with only spaces', () => {
        expect(isRealString('       ')).toBeFalsy();
    });

    it('should allow string with non-space character', () => {
        expect(isRealString('  lo tr ')).toBeTruthy();
    });

});