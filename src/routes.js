const express = require('express');
const crypto = require('crypto'); // pacote que vem com o NODE para encriptar

// Importando o celebrate para validação NPM INSTALL CELEBRATE
const { celebrate, Segments, Joi } =  require('celebrate');

const OngController = require('./controller/OngController');
const IncidentController = require('./controller/IncidentController');
const ProfileController = require('./controller/ProfileController');
const SessionController = require('./controller/SessionController');


const routes = express.Router();

routes.post('/sessions', SessionController.create);

routes.post('/ongs', celebrate({
    [ Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().max(11).min(10),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2),
    })

}), OngController.create);

routes.get('/ongs',  OngController.index); 

routes.get('/incidents', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number()
    })
}), IncidentController.index);
routes.post('/incidents', IncidentController.create);
routes.delete('/incidents/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
}), IncidentController.delete);

routes.get("/profile", celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
}), ProfileController.index);

routes.post('/users', (request, response) => {
    const body = request.body; // pega o corpo da requisição (tudo que foi enviado)
    console.log(body);
return response.json({
   body
})
}); 

module.exports = routes; // dessa forma exportamos essa váriável