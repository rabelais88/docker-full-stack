const request = require('supertest');
const app = require('../server');

describe('server.js', () => {
    it('GET / - 200 OK', async () => {
        await request(app)
            .get('/')
            .expect(200)
    })
})