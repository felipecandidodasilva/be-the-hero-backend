const conn = require('../database/connection');

module.exports = {
    async index(request, response) {
        //pegar o total de registros
        //usando colchetes pega o primeiro resultado
        const [count] = await conn('incidents').count();
        
        //Enviamos o total pelo cabeçalho
        response.header('X-Total-Count', count['count(*)']);

        // vamos paginar
        const {page = 1 }  = request.query // busca a pagian caso não exista define como 1
        /**requesty.query
         * esse query é quando se manda os parametros via url (user=1&name=felipe)
         */

        const incidents = await conn('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id') // junta com a tabela ongs
        .limit(4) // vai limitar a 5 registro
        .offset((page -1) * 5) // pular de 5 em 5 a partir da pagina pedida
        .select(['incidents.*',
         'ongs.name',
         'ongs.email',
         'ongs.email',
         'ongs.whatsapp',
         'ongs.city',
         'ongs.uf']);
        return response.json(incidents);
    },

    async create(request,response){
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization; // caracteriza o contexto da requisição
        
        const [id] = await conn('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        // const id = result[0]; so colocado result no lugar de [id]
        
        return response.json({ id }); // mandado com chaves, eviará o noe da informação que esta retornando, sem isso ele enviaria o objeto id
    },
    
    async delete(request,response) {
        const {id} = request.params;
        const ong_id = request.headers.authorization; // caracteriza o contexto da requisição

        const incident = await conn('incidents')
        .where('id', id) // quando o id da tabela for iguao ao id da constante id
        .select('ong_id')
        .first() // como só existe 1 id por incidente posso pegar o primeiro

        /**
         * Caso o ID da ong logada for diferente do id da ong que criou o incidente
         * vamos bloquear a exclusao.
         * mudando o status do http para 401 (operação não permitida) 
         * e mandando um json com uma mensagem
         * coloquei em inglês para treinar 
         */
        if(!incident){
            return response.status(400).json({ error: 'No incident found with this ID!'})
        }

        if(incident.ong_id !==  ong_id){
            return response.status(401).json({ error: 'Operation not permitted'});
        }

        await conn('incidents').where('id', id).delete() // deletar sempre com where !! basic ! !!!

        return response.status('204').send()

    }
}