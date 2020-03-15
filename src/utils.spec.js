const utils = require('./utils');

describe('utils.js: exported methods', () => { 
    describe('utils.js - capitalize', () => {    
        it('should export capitalize', () => {
            expect(utils.capitalize).toBeTruthy();
        });
    
        it('should return the sentence capitalized', () => {
            const sentence = utils.capitalize('abc xyz')
            expect(sentence).toEqual('Abc xyz');
        });

        it('should return an empty string in case of invalid param', () => {
            const sentence = utils.capitalize(745)
            expect(sentence).toBeFalsy();
        });
    });
});