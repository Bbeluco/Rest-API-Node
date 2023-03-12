const mysql = require('../mysql').pool;

const COMMON_URL = 'http://localhost:3000/produtos/'

exports.consultaTodosProdutos = (req, res, next) => {
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
                            url: COMMON_URL + prod.idprodutos,
                            produto_imagem: prod['produto_imagem']
                        }
                    })
                }
                res.status(200).send(response)
            }
        })
    })
}

exports.cadastroProduto = (req, res, next) => {
    const produtos = {
        nome: req.body.nome,
        preco: req.body.preco
    }

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }

        conn.query('INSERT INTO produtos (nome, preco, produto_imagem) VALUES (?, ?, ?)', 
        [produtos.nome, produtos.preco, req.file.path],
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
                    url: COMMON_URL + result.insertId,
                    produto_imagem: req.file.path
                }
                res.status(201).send(response)
            }
        }
        )
    })
}

exports.atualizaProduto = (req, res, next) => {
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
}

exports.deletaProduto = (req, res, next) => {
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
}

exports.consultaProdutoEspecifico = (req, res, next) => {
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
}