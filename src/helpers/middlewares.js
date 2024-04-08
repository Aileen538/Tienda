const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const Product = require('../models/product.model');

const validate = (validationSchema) => {
    return async (req, res, next) => {
        try {
            await validationSchema.validate(req.body, { abortEarly: false });
            next();
        } catch (error) {
            console.log(error);
            res.json(error.errors);
        }
    }
}

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            return next();
        }
        res.json({ fatal: 'No puedes pasar con ese rol' })
    }
}

const checkToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ fatal: 'Debes incluir el Token de autenticación' });
    }

    const token = req.headers.authorization;

    let obj;
    try {
        obj = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return res.status(401).json({ fatal: 'El token es incorrecto' });
    }

    const user = await User.findById(obj.id);
    req.user = user;

    next();
}

const checkProductId = async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.product_id);

        if (!product) {
            return res.status(400).json({ fatal: 'El id del producto no existe1' })
        }

        next();
    } catch (error) {
        res.status(400).json({ fatal: 'El id del producto no existe2' })
    }
}

module.exports = { validate, checkRole, checkToken, checkProductId };