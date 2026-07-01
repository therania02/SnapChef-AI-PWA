export const premiumMiddleware = (req, res, next) => {
    if (req.user.role !== "premium") {
        return res.status(403).json({
            success: false,
            message: "Fitur ini hanya untuk pengguna Premium."
        });
    }

    next();
};