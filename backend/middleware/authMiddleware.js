const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Ensure both id and userId are available for compatibility
        req.user = {
            ...decoded,
            id: decoded.id || decoded.userId,
            userId: decoded.userId || decoded.id
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = protect;
