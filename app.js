require('dotenv').config()
const express = require('express');
const Product = require('./model/prorductModel');
const mongodbConnect = require('./database');
const User = require('./model/userModel');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

mongodbConnect()
const app = express();
app.use(express.json())
app.use(cookieParser())


app.get('/product', async (req, res) => {
    try {
        const product = await Product.find();

        res.json({
            message: "Product fetched success",
            data: product
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


app.get('/product/:id', async (req, res) => {
    const { id } = req.params;

    const singleProduct = await Product.findById(id)

    res.json({
        message: "Product fetched success",
        data: singleProduct
    })
})

app.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            res.json({
                message: "Product not found"
            })
        }
        res.json({
            message: "Product deleted success."
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
})

app.patch('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, description, image } = req.body;
        const product = await Product.findByIdAndUpdate(id, { title, price, description, image });

        if (!product) {
            res.json({
                message: "Product not found."
            })
        }

        res.json({
            message: "Product updated success.",

        })
    } catch (error) {
        res.json({
            message: "Server Error",
            error: error.message
        })
    }
})


app.post('/product', async (req, res) => {
    try {
        const { title, price, description, image } = req.body;

        const product = await Product.create({ title, price, description, image });

        res.status(201).json({
            message: "Product created success",
            data: product
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
})


app.get('/user', async (req, res) => {
    try {
        const user = await User.find();
        res.json({
            message: "User fetched success",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
})


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {

        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                messasage: "User already exists."
            })
        }

        user = new User({ username, email, password });

        await user.save();

        res.status(201).json({
            message: "User registered successfully.",
            data: user
        })


    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }

})




app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid user email."
            })
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid user password"
            })
        }

        // generate a jwt token 
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )

        res.cookie('token', token)

        res.json({
            token:token,
            message: "Login Successfully."
        })


    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})










app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`)
})