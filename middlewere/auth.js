const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(400).json({ message: "You need to login!" });
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, token_data) {
        console.log(token_data,"us");
        if (err) return res.status(400).json({ message: "Forbidden", error: err });
        req.user = token_data;
        next();
    })
    
}
function authRole(...allowedRoles) {
    return function (req, res, next) {
    
        if (!allowedRoles.includes(req.user.user.role)) {
            return res.status(401).json({ message: "Not allowed" });
        }
        next();
    }
}

module.exports={authenticateToken,authRole}