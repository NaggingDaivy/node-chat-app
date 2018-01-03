
var {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {

        var from = 'Daivy';
        var text = 'Test message';
        var message = generateMessage(from, text);

        expect(message).toEqual(expect.objectContaining({from,text})); // assymetric equality
        expect(typeof message.createdAt).toBe('number');
        
    });

}); 