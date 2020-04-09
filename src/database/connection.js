const knex = require('knex');
const configuration = require('../../knexfile'); // voltei duas pastas para chegar na raiz

const config  = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development
const conn = knex(config); // pega a conexão de desenvolvimento

module.exports = conn;