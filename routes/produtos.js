const express = require('express')
const router = express.Router();

//Habilita rota GET e somente envia mensagem e status para o user
router.get('/', (req, res, next) => {
    res.status(200).send({
        message: 'GET atraves da rota'
    })
})

//Habilita rota POST e somente envia mensagem e status para o user
router.post('/', (req, res, next) => {
    res.status(200).send({
        message: 'POST atraves da rota'
    })
})

//Habilita rota PUT e somente envia mensagem e status para o user
router.put('/', (req, res, next) => {
    res.status(200).send({
        message: 'PUT atraves da rota'
    })
})

//Habilita rota DELETE e somente envia mensagem e status para o user
router.delete('/', (req, res, next) => {
    res.status(200).send({
        message: 'DELETE atraves da rota'
    })
})

//Habilita rota GET, captura um parametro passado e devolve ao usuario junto com o status
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    res.status(200).send({
        message: 'Voce acaba de requisitar um produto',
        id: id
    })
})

module.exports = router