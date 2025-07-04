const notFound = (req, res,next) =>{
    const error = new Error('not found -> ' + req.originalUrl);
    res.status(404);
    next(error);
}

const errorHandler = (err, req , res , next) =>{
    const statusCode = res.statusCode ;
    
    res.status(statusCode);
    res.json({
        message: err.message,
        stack : process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}

export {errorHandler , notFound};