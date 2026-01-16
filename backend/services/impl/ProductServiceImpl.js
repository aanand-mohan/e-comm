import ProductRepository from '../../repositories/ProductRepository.js';

class ProductServiceImpl {
    async getProducts(keyword) {
        return await ProductRepository.findWithQuery(keyword);
    }

    async getProductById(id) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(productData) {
        return await ProductRepository.create(productData);
    }

    async updateProduct(id, productData) {
        const updatedProduct = await ProductRepository.update(id, productData);
        if (!updatedProduct) {
            throw new Error('Product not found');
        }
        return updatedProduct;
    }

    async deleteProduct(id) {
        const success = await ProductRepository.delete(id);
        if (!success) {
            throw new Error('Product not found');
        }
        return { message: 'Product removed' };
    }
}

export default new ProductServiceImpl();
