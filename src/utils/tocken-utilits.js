import jwt from 'jsonwebtoken';

export const generateToken = ({
    publicclaims,
    registeredclaims,
    secretkey = process.env.jwtsecretkey,
}) => {
    return jwt.sign(
        {
            publicclaims,
            registeredclaims,
        },
        secretkey,
        { expiresIn: process.env.accesstoken_expirein  }   
    );
};

export const verifyToken = ({
    token,
    secretkey = process.env.jwtsecretkey,
}) => {
    try {
        return jwt.verify(token, secretkey);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
