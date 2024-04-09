const { model, Schema } = require('mongoose');

const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    department: String,
    available: Boolean,
    stock: Number,
    creator: {type: Schema.Types.ObjectId, ref: 'User'}  
}, {
    versionKey: false, // __v=0
    timestamps: true // createdAt, updatedAt
});

module.exports = model('product', productSchema);