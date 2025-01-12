const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(req.token_data)
    if (!token) {
        return res.status(400).json({ message: "You need to login!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, function (err, token_data) {
        
        if (err) return res.status(400).json({ message: "Forbidden", error: err });
        req.user = token_data;
        next();
    })
    
}
function authRole(...allowedRoles) {
    return function (req, res, next) {
        console.log(req.user,allowedRoles,"role")
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(401).json({ message: "Not allowed" });
        }
        next();
    }
}



module.exports={authenticateToken,authRole}