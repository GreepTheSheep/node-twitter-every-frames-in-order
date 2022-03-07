require('dotenv').config();
const Images = require('./entities/Images');
const img = new Images();
img.post("TBEA", 1000);