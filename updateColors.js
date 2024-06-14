const mongoose = require('mongoose');
const Image = require('./models/imageModel'); // Adjust the path as needed


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function updateColorField() {
    try {
        const images = await Image.find({ color: /.+\.png$/ });

        for (let image of images) {
            image.color = image.color.replace('.png', '');
            await image.save();
            console.log(`Updated image: ${image._id}`);
        }

        console.log('All relevant documents have been updated.');
    } catch (error) {
        console.error('Error updating documents:', error);
    } finally {
        // Close the connection to the database
        mongoose.connection.close();
    }
}

updateColorField();