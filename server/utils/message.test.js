
var {generateMessage} = require('./message');
var {generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {

        var from = 'Daivy';
        var text = 'Test message';
        var message = generateMessage(from, text);

        expect(message).toEqual(expect.objectContaining({from,text})); // assymetric equality
        expect(typeof message.createdAt).toBe('number');
        
    });

}); 

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {

        var from = 'Daivy';
        var latitude = '50.6287547';
        var longitude = '5.5259706';
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;

        var locationMessage = generateLocationMessage(from,latitude,longitude);

        expect(locationMessage.from).toBe(from);
        expect(locationMessage.url).toBe(url);
        expect(typeof locationMessage.createdAt).toBe('number');


    })

});