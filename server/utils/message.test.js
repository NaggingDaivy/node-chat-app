
var {generateMessage} = require('./message');

describe('generateMessage', () => {
    test('should generate correct message object', () => {

        var from = 'Daivy';
        var text = 'Test message';
        var message = generateMessage(from, text);

        // expect(message.from).toBe(from);
        // expect(message.text).toBe(text);
        // expect(message).toContain({from,text});

        // console.log(expect.objectContaining({from,text}));
        expect(message).toEqual(expect.objectContaining({from,text}));
        expect(typeof message.createdAt).toBe('number');
        
    });

}); 