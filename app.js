const express = require('express')
const app = new express(); //Isso é uma instancia de express, mesmo sem a palavra new na frente

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

module.exports = app;