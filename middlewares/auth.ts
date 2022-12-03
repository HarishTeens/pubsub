import { ethers } from "ethers";
import jwt_decode from "jwt-decode";

const auth = (req, res, next) => {
    try {        
        const headerToken = req.headers.authorization;
        const jwtToken = headerToken.split(" ")[1] ? headerToken.split(" ")[1] : null;
        const decoded = jwt_decode(jwtToken);
        const public_key = '0x' + (decoded as any).wallets[0].public_key;
        const walletAddress = ethers.utils.computeAddress(public_key);
        req.auth = {};
        req.auth['user'] = walletAddress;
        next();
    } catch (error) {        
        console.log(error)
        res.json({
            error: true,
            message: "JWT not provided or invalid"
        })
    }
}

export default auth;