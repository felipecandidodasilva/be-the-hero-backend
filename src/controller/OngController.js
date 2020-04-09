const generateUniqueId = require('../utils/generateUniqueId');
const conn = require('../database/connection');

module.exports = {
// async, faz a função se assincrona
    async index(request, response) {
        const ongs = await conn('ongs').select('*');
        return response.json(ongs);
    },

    async create(request, response){
        const {name, email, whatsapp, city, uf} = request.body;

        const id = generateUniqueId();

        // await, faz o node esperar o codigo terminar para continuar
        await conn('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf,
        });
        
        return response.json({id}); // devolvo somente o ID
    }
}