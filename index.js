//Se importa la clase
const ProductManager = require("./ProductManager.js");
let productManager = new ProductManager(); 

const express = require('express');
const app = express();
const PORT = 9090;

app.get('/saludo', (req,res) =>{
    res.send("Hola desde servidor con express")
})

app.get('/products', async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.send(productos);
    } catch (error) {
        console.error(`Error al obtener productos: ${error}`);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productoId = parseInt(req.params.pid); // Convertir el parámetro a número
        const productoEncontrado = await productManager.getProductById(productoId);

        if (productoEncontrado) {
            res.json(productoEncontrado);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error(`Error al obtener producto por ID: ${error}`);
        res.status(500).send('Error interno del servidor');
    }
});

//Funcion para agregar, actualizar,encontrar por ID y eliminar productos
let agregarProducto = async () => {
    await productManager.addProduct("Consola PS5", "Version Standard 815GB", 10500, "http://ps5.jpg", 784469513878, 12);
    await productManager.addProduct("Control Xbox Series", "Carbon Black", 1200, "http://controlXbox.jpg", 484184887665, 5);
    await productManager.addProduct("Mica de cristal para Nintendo Switch", "Protector para consola",250, "http://Crystalscreen.jpg", 42983572934, 17)
    await productManager.addProduct("Ryzen 7 5800X", "procesador para computadora",4500, "http://AMD.jpg", 784469513878, 8)
    let productos = await productManager.getProducts();
    console.log(`Productos encontrados en Product manager: ${productos.length}`);
    console.log(productos);

    // let actualizarProducto = await productManager.updateProduct(1, 'price', 9700);
    // console.log("Se ha actualizado el siguiente producto:");
    // console.log(actualizarProducto);

    // let productoEncontrado = await productManager.getProductById(2);
    // console.log('Producto encontrado:');
    // console.log(productoEncontrado);

    // let productoEliminado = await productManager.deleteProduct(1);
    // console.log(`Producto con ID ${productoEliminado} eliminado.`);
    
    // productos = await productManager.getProducts();
    // console.log(`Productos después de eliminar uno: ${productos.length}`);
    // console.log(productos);
}

agregarProducto();

app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});