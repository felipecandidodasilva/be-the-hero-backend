const request = require('supertest');
const app = require('../../src/app');
const conn = require('../../src/database/connection');

describe('ONG', () => {
    beforeEach(async () => {
        await conn.migrate.rollback(); // zerando banco de dados
        await conn.migrate.latest(); // criando as tabelas
    });

    afterAll(async () => {
        await conn.destroy();
    });

   it('Should be able to create a new ONG', async () => {
        const response = await request(app)
        .post('/ongs')
        .send({
            "name" : "Nova Ong Test",
            "email" : "administracao@teste.com.br",
            "whatsapp" : "27999999999",
            "city" : "Cidade",
            "uf" : "UF"
        });

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    }); 
});