const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastro = (req, res, next) => {
    const email = req.body.email
    const senha = req.body.senha
    bcrypt.hash(senha, 10, (errBcrypt, hash) => {
        if(errBcrypt) { return res.status(500).send({ error: error })}

        mysql.getConnection((error, conn) => {
            if(error) {
                res.status(500).send({
                    error: error,
                    response: null
                })
            } else {
                conn.query(`INSERT INTO usuarios(email, senha) VALUES ('${email}', '${hash}')`, 
                (error, result, fields) => {
                    conn.release();
                    if(error) { return res.status(500).send({ error: error})}
                    return res.status(201).send({
                        mensagem: "usuario criado com sucesso",
                        idusuario: result.insertId,
                        email: email
                    })
                })
            }
        })

    })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const senha = req.body.senha;

    mysql.getConnection((error, conn) => {
        if(error) { res.status(500).send({ error: error }) }
        conn.query(`SELECT * FROM usuarios WHERE email='${email}'`,
        (err, result, fields) => {
            if(err) { return res.status(500).send({ mensagem: "Erro ao se comunicar com o banco de dados" })}
            bcrypt.compare(senha, result[0].senha, (errBcrypt, bcryptCompare) => {
                if(bcryptCompare) {
                    const token = jwt.sign({
                        idusuario: result[0].idusuario,
                        email: result[0].email
                    }, 
                    "segredo_para_token_jwt", 
                    {
                        expiresIn: '1h'
                    })
                    return res.status(200).send({ 
                        mensagem: "Login efetuado com sucesso",
                        token: token
                    })
                }

                return res.status(404).send({ mensagem: "Usuario/senha invalidos" })
            })
        })
    })
}