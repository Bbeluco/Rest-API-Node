const express = require('express')
const app = express(); //Isso é uma instancia de express, mesmo sem a palavra new na frente

app.use((req, res, next) => {
    res.status(200).send({
        message: 'Tudo certo, funcionando'
    })
})

module.exports = app;