const express = require('express')
const morgan = require('morgan');
const app = new express(); //Isso é uma instancia de express, mesmo sem a palavra new na frente

app.use(morgan('dev')) //Printa LOG na tela do DEV

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');


app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

app.use((req, res, next) => {
    const error = new Error('Rota nao encontrada');
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.send({
        erro: {
            message: error.message
        }
    })
})

module.exports = app;