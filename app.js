const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const app = new express(); //Isso é uma instancia de express, mesmo sem a palavra new na frente

app.use(morgan('dev')) //Printa LOG na tela do DEV
app.use(bodyParser.urlencoded({ extended: false })) //So quero trabalhar com JSON
app.use(bodyParser.json()) //Converto o que eu receber para json

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if(req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, DELETE, POST, GET')
        return res.status(200).send({})
    }

    next()
})
//

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');


app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

//Quem nao encontra rota entra aqui
app.use((req, res, next) => {
    const error = new Error('Rota nao encontrada');
    error.status = 404
    next(error) //Repassa as informacoes daqui para o proximo app.use
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