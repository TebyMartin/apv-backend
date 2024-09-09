import express from 'express'
import {registrar, perfil, confirmar,autenticar, olvidePassword,comprobarToken,nuevoPassword, actualizarPerfil,actualizarPassword}from '../controllers/veterinarioControllers.js'
import checkAuth from '../middleware/autMiddleware.js'

const router = express.Router()


//rutas para el area publica no se necesita cuenta para utilizarlas
router.post('/', registrar)
router.get("/confirmar/:token", confirmar);
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

//mildeware area privada 
router.get('/perfil', checkAuth, perfil)
router.put('/perfil/:id', checkAuth, actualizarPerfil)
router.put('/actualizar-password', checkAuth, actualizarPassword)

export default router