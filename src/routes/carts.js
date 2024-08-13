import express from 'express';
import CartsManager from '../dao/CartsManager.js';

const router = express.Router();

// carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await CartsManager.addCart();  
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Erroral crear carro' });
    }
});

// ppid
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = await CartsManager.getCartProducts(cartId);

        if (!products) {
            return res.status(404).json({ error: 'Carro no encontrado' });
        }

        res.json(products);
    } catch (error) {
        console.error('error al recuperar los productos:', error.message);
        res.status(500).json({ error: 'error al recuperar los productos' });
    }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedProducts = await CartsManager.addProductToCart(cartId, productId);
        res.json(updatedProducts);
    } catch (error) {
        if (error.message.includes('carrito con id')) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('producto con id')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('error al agregar productos al carrito:', error.message);
        res.status(500).json({ error: 'error al agregar productos al carrito' });
    }
});


export default router;