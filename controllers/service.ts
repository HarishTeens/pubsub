const createService = () => {

}

const listServices = (req, res) => {
    res.json({
        user: req.auth.user
    })
}


const services = {
    createService,
    listServices
}

export default services;