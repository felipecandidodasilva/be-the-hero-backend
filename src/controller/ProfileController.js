const conn = require('../database/connection');

module.exports = {
    async index(request, response) {
        const ong_id = request.headers.authorization; // pegoo ID no cabeçalho

        const incidents = await conn('incidents') // busco na tabela incidents
        .where('ong_id', ong_id) // quando a ong_ig for igual ao ong_id logado
        .select('*') // trago todas
        
        return response.json(incidents);
    },

  
}