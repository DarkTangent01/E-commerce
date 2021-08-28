const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const auth = require('../middleware/auth');
const adminauth = require('../middleware/adminauth');
const categoryById = require('../middleware/categoryId');

const { check, validationResult } = require('express-validator');


/* @route POST  api/category
   @desc  Create Category
   @access  Private Admin 
*/

router.post('/', [
    check('name', 'Name is required').trim().not().isEmpty()
], auth, adminauth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }
    const { name } = req.body;
    try {
        let category = await Category.findOne({ name })

        if (category) {
            return res.status(403).json({
                error: 'Category already exist'
            })
        }

        const newCategory = new Category({ name });
        category = await newCategory.save();
        res.json(category);
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error');
    }
    // res.send('ok');
});

/* @route POST  api/category/all
   @desc  Get all category
   @access  Public
*/

router.get('/all', async (req, res) => {
    try {
        let data = await Category.find({});
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});


/* @route POST  api/category/categoryId
   @desc  Get one category
   @access  Public
*/

router.get('/:categoryId', categoryById, async (req, res) => {
    res.json(req.category);
});

/* @route PUT  api/category/categoryId
   @desc  Update Single category
   @access  Private Admin
*/

router.put('/:categoryId', auth, adminauth, categoryById, async (req, res) => {
    let category = req.category;
    const { name } = req.body
    if (name) category.name = name.trim();

    try {
        category = await category.save();
        res.json(category);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

/* @route Delete api/category/:categoryId
   @desc  Delete Single category
   @ access Private Admin 
*/

router.delete('/:categoryId', auth, adminauth, categoryById, async (req, res) => {
    let category = req.category;
    try {
        let deletedCategory = await category.remove();
        res.json({
            message: `${deletedCategory.name} deleted successfully`
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
})



module.exports = router;