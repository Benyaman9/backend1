import fs from 'fs';
import path from 'path';
import ProductsManager from './ProductsManager.js'; 


const cartsFilePath = path.resolve('src/data/cart.json');

class CartsManager {
    static async getCarts() {
        if (fs.existsSync(cartsFilePath)) {
            return JSON.parse(await fs.promises.readFile(cartsFilePath, 'utf-8'));
        } else {
            return [];
        }
    }

    static async addCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: uuidv4(), 
            products: []
        };

        carts.push(newCart);

        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

        return newCart;
    }

    static async getCartProducts(cartId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(c => c.id === cartId);

            if (!cart) {
                return null;
            }

            return cart.products;
        } catch (error) {
            console.error('error al recuperar productos:', error.message);
            throw new Error('error al recuperar productos');
        }
    }

    static async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) {
            throw new Error(`carrito con id ${cartId} no encontrado.`);
        }
    
        const products = await ProductsManager.getProducts();
        const product = products.find(p => p.id === productId);
        if (!product) {
            throw new Error(`producto con id ${productId} no encontrado.`);
        }
    
        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }
    
        await fs.promises.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    
        return cart.products;
    }
    
}

export default CartsManager;