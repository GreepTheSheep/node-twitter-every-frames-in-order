require('dotenv').config();
const Images = require('./entities/Images');
const img = new Images();
img.execute();

// API
const express = require('express'),
    app = express(),
    port = Number(process.env.API_PORT) || 3000,
    cors = require('cors'),
    logger = require('morgan'),
    createError = require('http-errors');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.get('/actual', (req, res, next) => {
    res.json(img.getActual());
});

app.get('/all', (req, res, next) => {
    res.json(img.getAll());
});

app.get('/user', (req, res, next) => {
    img.twt.getUser().then(data => {
        res.json(data);
    }).catch(err => {
        next(createError(500, err));
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404, 'Not found'));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500).json({
        error: {
            code: err.status || 500,
            message: err.message
        }
    });
});

app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});