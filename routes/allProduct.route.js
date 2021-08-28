const express = require('express');
const router = express.Router();
const Product = require('../models/product');

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


router.get('/categories', async(req, res) => {
    try {
        let categories = await Product.distinct('category');
        if(!categories){
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(categories);
    }
    catch(error){
        console.log(error);
        res.status(500).send('Server Error');
    }
});


router.get('/search', async(req, res) => {
    const query = {};

    if (req.query.search){
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }

        // assign category

        if(req.query.category && req.query.category != 'All'){
            query.category = req.query.category;
        }
    }

    try {
        let products = await Product.find(query).select('-photo');
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error to get products');
    }
});



module.exports = router;