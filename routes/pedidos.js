const express = require('express')
const router = express.Router();
const pedidosController = require('../controllers/pedidos-controller')

router.get('/', pedidosController.consultaPedidos)
router.get('/:id_pedido', pedidosController.consultaPedidoEspecifico)
router.post('/', pedidosController.criacaoPedido)
router.delete('/:id_produto', pedidosController.deletaPedidos)

module.exports = router