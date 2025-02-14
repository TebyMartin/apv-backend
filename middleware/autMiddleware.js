import jwt from "jsonwebtoken"
import Veterinario from "../models/Veterinario.js"

const checkAuth = async (req, res, next) => {
    let token
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.veterinario = await Veterinario.findById(decode.id).select("-password -token -confirmado")
            return next()
        } catch (error) {
            const err = new Error('token no valido ')
            return res.status(403).json({msg:err.message})
        }
    } 

    if (!token) {
        const error = new Error('token no valido o inexistente')
        res.status(403).json({msg:error.message})
    }

    
        
    next() //se va al siguiente en el ejemplo tenemos perfil por ende se va ahi
}

export default checkAuth