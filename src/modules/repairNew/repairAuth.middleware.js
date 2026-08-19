// auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

// Authenticate user & attach req.user
export const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not logged in. Please provide a valid token.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id || decoded._id);

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "User belonging to this token no longer exists.",
            });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message,
        });
    }
};

// Restrict access by roles (case-insensitive)
export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role?.toUpperCase();
        const normalizedRoles = allowedRoles.map((role) => role.toUpperCase());

        if (!normalizedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }

        next();
    };
};