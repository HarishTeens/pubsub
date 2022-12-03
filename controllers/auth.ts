import UserModel from '../models/User';

const getUserNonce = async (req, res) => {
    const addr = req.params.address;
    const userInfo = await UserModel.findById(addr);
    if (userInfo) {
        const userObj = userInfo.toObject();        
        res.json({
            nonce: userObj.nonce
        })
    } else {
        UserModel.create()
    }
    
    const nonce = Math.floor(Math.random() * 1000000);

    res.json({
        nonce
    })
    

}


const auth = {
    getUserNonce
}


export default auth;