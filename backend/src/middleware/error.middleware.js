const errorHandler = (er, req, res, next) => {
    console.log(error);

    res.status(500).json({
        message: "Something went wrong",
    });
};

module.exports = errorHandler;