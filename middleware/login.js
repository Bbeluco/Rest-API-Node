const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const header_token = req.headers['authorization'].split('Bearer ')[1]
        const decode = jwt.verify(header_token, "segredo_para_token_jwt");
        req.usuario = decode;
        next()
    } catch(error) {
        return res.status(401).send({ mensagem: "Token inválido" })
    }
}
