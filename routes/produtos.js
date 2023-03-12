const express = require('express')
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login')
const produtosController = require('../controllers/produtos-controller')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },

    filename: function(req, file, cb) {
        cb(null, new Date().toDateString() + file.originalname);
    }
})

const fileTypeFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    cb(null, false)
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileTypeFilter 
})

//upload.single('produto_imagem') espera receber no forms a imagem atraves do campo 'produto_imagem'
router.post('/', upload.single('produto_imagem'), login, produtosController.cadastroProduto)
router.get('/', produtosController.consultaTodosProdutos)
router.get('/:id_produto', produtosController.consultaProdutoEspecifico)
router.put('/:id_produto', login, produtosController.atualizaProduto)
router.delete('/:id_produto', login, produtosController.deletaProduto)

module.exports = router