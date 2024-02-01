class Producto {
    constructor(id,title,description,price,thumbnail,code,stock,) {
        
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code
        this.stock = stock
        
    }

    static asignarIdAutoincrementable() {
        if (!Producto.contadorId) {
            Producto.contadorId = 1;
        } else {
            Producto.contadorId++;
        }
        return Producto.contadorId;
    }
};

class ProductManager {
   
    products;
    productsDirPath;
    productsFilePath;
    fileSystem;

    constructor() {
        this.products = new Array();
        this.productsDirPath = "./files";
        this.productsFilePath = this.productsDirPath + "/productos.json";
        this.fileSystem = require("fs");
    }

    addProduct = async (title,description,price,thumbnail,code,stock) => {
        const id = Producto.asignarIdAutoincrementable();
        let productoNuevo = new Producto(id,title, description, price, thumbnail,code,stock);
        console.log("Crear Producto: Producto registrado:");
        console.log(productoNuevo);
        try {
            //Creamos el directorio
            await this.fileSystem.promises.mkdir(this.productsDirPath, { recursive: true });

            //Validamos que exista ya el archivo con productos sino se crea vacío para ingresar nuevos:
            if (!this.fileSystem.existsSync(this.productsFilePath)) {
                //Se crea el archivo vacio.
                await this.fileSystem.promises.writeFile(this.productsFilePath,"[]");
            }

            //leemos el archivo
            let productsFile = await this.fileSystem.promises.readFile(this.productsFilePath, "utf-8");
            console.info("Archivo JSON obtenido desde archivo: ");
            console.log(productsFile);

            // Agregamos al array la informacion que hay en el archivo y ademas hacemos un parseo de .json a Objeto.
            this.products = JSON.parse(productsFile);
            console.log("Productos encontrados: ");
            console.log(this.products);

            this.products.push(productoNuevo);
            console.log("Lista actualizada de productos: ");
            console.log(this.products);

            //Se sobreescribe el archivos de productos para persistencia.
            await this.fileSystem.promises.writeFile(this.productsFilePath, JSON.stringify(this.products, null, 2, '\t'));

        } catch (error) {
            console.error(`Error creando producto nuevo: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
            throw Error(`Error creando producto nuevo: ${JSON.stringify(productoNuevo)}, detalle del error: ${error}`);
        }
    }

    getProducts = async () => {
        try {
            //Creamos el directorio
            await this.fileSystem.promises.mkdir(this.productsDirPath, { recursive: true });

            //Validamos que exista ya el archivo con productos sino se crea vacío para ingresar nuevos:
            if (!this.fileSystem.existsSync(this.productsFilePath)) {
                //Se crea el archivo vacio.
                await this.fileSystem.promises.writeFile(this.productsFilePath, "[]");
            }

            //leemos el archivo
            let prductsFile = await this.fileSystem.promises.readFile(this.productsFilePath, "utf-8");
            //Obtenemos el JSON String 
            console.info("Archivo JSON obtenido desde archivo: ");
            console.log(prductsFile);

            this.products = JSON.parse(prductsFile);
            console.log("Productos encontrados: ");
            console.log(this.products);

            return this.products;
        } catch (error) {
            console.error(`Error consultando los productos por archivo, valide el archivo: ${this.productsDirPath}, 
                detalle del error: ${error}`);
            throw Error(`Error consultando los productos por archivo, valide el archivo: ${this.productsDirPath},
             detalle del error: ${error}`);
        }
    }

    updateProduct = async (productId, fieldToUpdate, updatedValue) => {
        try {
            // Leemos el archivo
            let productosFile = await this.fileSystem.promises.readFile(this.productsFilePath, "utf-8");

            // Convertimos el contenido del archivo a un array de productos
            let productos = JSON.parse(productosFile);

            // Buscamos el índice del producto por su ID
            const index = productos.findIndex(producto => producto.id === productId);

            if (index !== -1) {
                // Actualizamos el campo del producto
                productos[index][fieldToUpdate] = updatedValue;

                // Sobreescribimos el archivo con los productos actualizados
                await this.fileSystem.promises.writeFile(this.productsFilePath, JSON.stringify(productos, null, 2, '\t'));

                return productos[index]; // Devolvemos el producto actualizado
            } else {
                console.log(`No se encontró ningún producto con ID ${productId}`);
                return null;
            }
        } catch (error) {
            console.error(`Error actualizando producto con ID ${productId}, detalle del error: ${error}`);
            throw Error(`Error actualizando producto con ID ${productId}, detalle del error: ${error}`);
        }
    }

    getProductById = async (productId) => {
        try {
            // Leemos el archivo
            let productosFile = await this.fileSystem.promises.readFile(this.productsFilePath, "utf-8");

            // Convertimos el contenido del archivo a un array de productos
            let productos = JSON.parse(productosFile);

            // Buscamos el producto por su ID
            let productoEncontrado = productos.find(producto => producto.id === productId);

            return productoEncontrado || null; // Devolvemos el producto encontrado o null si no se encuentra
        } catch (error) {
            console.error(`Error obteniendo producto por ID ${productId}, detalle del error: ${error}`);
            throw Error(`Error obteniendo producto por ID ${productId}, detalle del error: ${error}`);
        }
    }

deleteProduct = async (productId) => {
        try {
            // Leemos el archivo
            let productosFile = await this.fileSystem.promises.readFile(this.productsFilePath, "utf-8");

            // Convertimos el contenido del archivo a un array de productos
            let productos = JSON.parse(productosFile);

            // Filtramos el array para excluir el producto con el ID proporcionado
            let productosActualizados = productos.filter(producto => producto.id !== productId);

            // Si el array no cambió, significa que no se encontró ningún producto con el ID
            if (productos.length === productosActualizados.length) {
                console.log(`No se encontró ningún producto con ID ${productId}`);
                return null;
            }

            // Sobreescribimos el archivo con los productos actualizados
            await this.fileSystem.promises.writeFile(this.productsFilePath, JSON.stringify(productosActualizados, null, 2, '\t'));

            // Eliminamos el archivo si no quedan productos
            if (productosActualizados.length === 0) {
                await fsPromises.unlink(this.productsFilePath);
                console.log("Archivo de productos eliminado, ya no hay productos.");
            }

            console.log(`Producto con ID ${productId} eliminado`);
            return productId; // Devolvemos el ID del producto eliminado
        } catch (error) {
            console.error(`Error eliminando producto con ID ${productId}, detalle del error: ${error}`);
            throw Error(`Error eliminando producto con ID ${productId}, detalle del error: ${error}`);
        }
    }
};


module.exports = ProductManager; 

