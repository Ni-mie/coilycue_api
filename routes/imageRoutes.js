const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Image = require('../models/imageModel');

router.get('/:category/:hairstyle/:color', async (req, res) => {
    const { category, hairstyle, color } = req.params;
    try {
        // Construct the file path to the requested image
        const imagePath = path.join(__dirname, '..', 'uploads', category, hairstyle, color);
        const imageUrl = `https://coilycue-api.onrender.com/images/${category}/${hairstyle}/${color}`;
        // Check if the image file exists
        await fs.access(imagePath);

        // If the image file exists, create a new document in MongoDB
        const image = new Image({
            category,
            hairstyle,
            color,
            imageUrl // URL to access the image
        });
        
        // Save the image document to MongoDB
        await image.save();
        console.log('Image document saved to MongoDB:', image);

        // Serve the image file
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(404).send('Image not found');
    }
});

router.get('/all', async (req, res) => {
    try {
        // Query the MongoDB images collection to retrieve all image documents
        const images = await Image.find();

        const hairstyleLists = {};

        images.forEach(image => {
            const { hairstyle, color } = image;

            // Initialize an empty array for the hairstyle if not exists
            if (!hairstyleLists[hairstyle]) {
                hairstyleLists[hairstyle] = [];
            }

            // Add the image to the appropriate list
            if (color === 'black') {
                // Add black images to the beginning of the list
                hairstyleLists[hairstyle].unshift(image);
            } else {
                // Add non-black images to the end of the list
                hairstyleLists[hairstyle].push(image);
            }
        });

        // Send the organized lists as a JSON response
        res.json(hairstyleLists);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/hairstyle/:hairstyle', async (req, res) => {
    const { hairstyle } = req.params;
    try {
        // Query MongoDB to retrieve all image documents for the specified hairstyle
        const images = await Image.find({ hairstyle });

        // Send the retrieved image documents as a JSON response
        res.json(images);
    } catch (error) {
        console.error('Error fetching images by hairstyle:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/categories', async (req, res) => {
    try {
      
        const categories = await Image.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/colors', async (req, res) => {
    try {
      
        const colors = await Image.distinct('color');
        res.json(colors);
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        // Extract the category from the request parameters
        const { category } = req.params;

        // Query MongoDB to retrieve image documents for the specified category
        const images = await Image.find({ category });

        // Send a JSON response containing the image documents
        res.json(images);
    } catch (error) {
        console.error('Error fetching images by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;