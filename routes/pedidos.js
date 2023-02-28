const express = require('express')
const router = express.Router();

router.get('/:id_pedido', (req, res, next) => {
    const idPed = req.params.id_pedido
    res.status(200).send({
        id: Number(idPed),
        message: 'O seu pedido está OK'
    })
})

router.post('/', (req, res, next) => {
    res.status(200).send({
        message: 'Pedido criado com sucesso!',
        id: '122'
    })
})

module.exports = router