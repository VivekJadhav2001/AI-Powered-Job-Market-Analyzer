
export const globalResponse = (req,res,next)=>{
    res.success = (statusCode = 200, message = "Success", data = null) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    };

    res.error = (statusCode = 500, message = "Internal Server Error", error = null) => {
        return res.status(statusCode).json({
            success: false,
            message,
            error
        });
    };

    next()
}

export const globalError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message
    });
};