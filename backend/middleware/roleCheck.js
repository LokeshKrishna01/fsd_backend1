export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

export const requireUser = (req, res, next) => {
    if (req.user && req.user.role === 'USER') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. This endpoint is for regular users only.'
        });
    }
};
