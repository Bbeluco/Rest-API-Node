const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;

const COMMON_URL = 'http://localhost:3000/pedidos/'

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ mensagem: "Erro ao tentar se comunicar com o Banco de Dados" })}
        conn.query('SELECT * FROM produtos INNER JOIN pedidos ON produtos.idprodutos = pedidos.idpedidos;', 
        (error, result, fields) => {
            conn.release();

            if(error) {
                return res.status(500).send({
                    mensagem: "Erro ao obter informações do Banco de Dados",
                    error: error
                })
            } else {
                const pedidos = result.map(pedido => {
                    return {
                        idpedidos: pedido.idpedidos,
                        quantidade: pedido.quantdade,
                        produto: {
                            produtos_idprodutos: pedido.produtos_idprodutos,
                            nome: pedido.nome,
                            preco: pedido.preco
                        },
                        
                        url: COMMON_URL + pedido.idpedidos
                    }
                })

                return res.status(200).send(pedidos)
            }
        })
    })
})

router.get('/:id_pedido', (req, res, next) => {
    const id_pedido = req.params.id_pedido
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ mensagem: "Erro ao se comunicar com o Banco de Dados" })}
        conn.query(`SELECT * FROM pedidos WHERE idpedidos=${id_pedido}`,
        (error, result, fields) => {
            conn.release();

            if(error) {
                res.status(500).send({
                    mensagem: "Erro ao retornar pedido solicitado no banco de dados. Por favor certifique se o ID está correto"
                })
            } else {
                res.status(200).send(result)
            }
        })
    })
})

router.post('/', (req, res, next) => {
    quantidade = req.body.quantidade;
    produtos_idprodutos = req.body.produtos_idprodutos;

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ message: 'Erro ao se comunicar com o Banco de Dados'})}
        conn.query(`SELECT * FROM produtos WHERE idprodutos=${produtos_idprodutos}`, 
        (error, result, fields) => {
            if(error){
                return res.status(500).send({
                    message: 'Erro ao resgatar o valor, contate o ADM'
                })
            } else if (result.length == 0){
                return res.status(404).send({
                    message: "Nenhum produto com este ID foi encontrado"
                })
            }
        })

        
        conn.query(`INSERT INTO pedidos (quantdade, produtos_idprodutos) VALUES (${quantidade}, ${produtos_idprodutos})`,
        (error, result, fields) => {
            conn.release();

            if(error) {
                return res.status(500).send({
                    message: 'Não foi possivel adicionar esta entrada ao banco, certifique-se que o "produtos_idprodutos" está correto'
                })
            } else {
                const pedidoCriado = {
                    messagem: 'Pedido criado com sucesso',
                    idpedidos: result.insertId,
                    quantidade: quantidade,
                    produtos_idprodutos: produtos_idprodutos,
                    url: COMMON_URL + result.insertId
                }

                res.status(201).send(pedidoCriado)
            }
        })
    })
})

router.delete('/:id_produto', (req, res, next) => {
    const id_produto = req.params.id_produto

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ mensagem: 'Erro ao se comunicar com o Banco de Dados' })}
        conn.query(`DELETE FROM pedidos WHERE idpedidos=${id_produto}`,
        (error, result, fields) => {
            if(error) {
                res.status(500).send({
                    mensagem: "Erro ao retornar pedido solicitado no banco de dados. Por favor certifique se o ID está correto"
                })
            } else {
                res.status(201).send({
                    mensagem: "Registro apagado com sucesso!"
                })
            }
        })
    })
})

module.exports = router