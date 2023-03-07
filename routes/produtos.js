const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;

const COMMON_URL = 'http://localhost:3000/produtos/'

//Habilita rota GET e somente envia mensagem e status para o user
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query('SELECT * FROM produtos',
        (error, result, field) => {
            conn.release();

            if(error) {
                res.status(500).send({
                    error: error,
                    response: null
                })
            } else {
                const response = {
                    quantidade_catalogo: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.idprodutos,
                            nome: prod.nome,
                            preco: prod.preco,
                            url: COMMON_URL + prod.idprodutos
                        }
                    })
                }
                res.status(200).send(response)
            }
        })
    })
})

//Habilita rota POST e somente envia mensagem e status para o user
router.post('/', (req, res, next) => {
    const produtos = {
        nome: req.body.nome,
        preco: req.body.preco
    }

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }

        conn.query('INSERT INTO produtos (nome, preco) VALUES (?, ?)', 
        [produtos.nome, produtos.preco],
        (error, result, field) => {
            conn.release()


            if(error) {
                res.status(500).send({
                    error: error,
                    response: null
                })
            } else {
                const response =  {
                    messagem: "Produto criado com sucesso!",
                    id_produto: result.insertId,
                    nome: produtos.nome,
                    preco:  produtos.preco,
                    url: COMMON_URL + result.insertId
                }
                res.status(201).send(response)
            }
        }
        )
    })
})

//Habilita rota PUT e somente envia mensagem e status para o user
router.put('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    if(Object.keys(req.body).length > 1){
        return res.status(400).send({
            message: 'somente é permitido enviar um campo por vez'
        })
    }
    const value_to_change = req.body.nome || req.body.preco
    const field_to_change = Object.keys(req.body)[0]

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error})}
        conn.query(`UPDATE produtos SET ${field_to_change}="${value_to_change}" WHERE idprodutos=${id}`,
        (error, resposta, field) => {
            conn.release();
            if(error) {
                res.status(500).send({ 
                    error: error,
                    resposta: null
                })
            } else {
                res.status(200).send({
                    message: resposta
                })
            }
        })
    })
})

//Habilita rota DELETE e somente envia mensagem e status para o user
router.delete('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query('DELETE FROM produtos WHERE idprodutos=(?)', 
        [id],
        (error, result, fields) => {
            conn.release();
            if(error) {
                res.status(500).send({ 
                    error: error,
                    response: null
                })
            } else {
                res.status(201).send({
                    message: "Produto deletado com sucesso",
                    resposta: result
                })
            }
        })
    })
})

//Habilita rota GET, captura um parametro passado e devolve ao usuario junto com o status
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error})}
        conn.query(`SELECT * FROM produtos WHERE idprodutos=${id}`,
        (error, result, fields) => {
            conn.release();

            if(error) {
                return res.status(500).send({
                    error: error,
                    response: null
                })
            } else if(result.length == 0) {
                return res.status(404).send({
                    mensagem: "Voce pesquisou por um ID inválido, tente novamente com outro ID"
                })
            } else {
                return res.status(200).send(result)
            }
        })
    })
})

module.exports = router