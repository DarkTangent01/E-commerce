const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const {send} = require('process');

/* @ route GET api/products/list
   @ desc Get a list of product with filter
   @ options (order = asc or desc, sortBy any product property like name, limit, number of returned product)
   @ access Public
*/

router.get('/list', async (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    try {
        let products = await Product.find({}).select('-photo').populate('category').sort([[sortBy, order]]).limit(limit).exec();
        res.json(products);
    } catch (error) {
        conosle.log(error);
        res.status(500).send('Invalid query');
    }


});

/* @ route GET api/products/categories
   @ desc Get a list categories of products
   @ access Public
*/


router.get('/categories', async (req, res) => {
    try {
        let categories = await Product.distinct('category');
        if (!categories) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(categories);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});




router.get('/search', async (req, res) => {
    const query = {};

    if (req.query.search) {
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }

        // assign category

        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
    }

    try {
        let products = await Product.find(query).select('-photo');
        if (products.length !== 0) {
            res.json(products);
        } else {
            res.json({
                message: "Product not found",
            })
        }
        console.log(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error to get products');
    }
});


/* @ route POST api/products/filter
   @ desc filter a product by price and category
   @ access Public
*/

router.post('/filter', async (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte - greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    try {
        let products = await Product.find(findArgs).select('-photo').populate('category').sort([[sortBy, order]]).skip(skip).limit(limit);
        res.json(products);

    } catch (error) {
        console.log(error);
        res.status(500).send('Products not found');
    }
});




module.exports = router;