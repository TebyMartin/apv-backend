import express from 'express'

const router = express.Router()
import{agregarpaciente,obtenerpacientes,obtenerPaciente, actualizarPaciente,eliminarPaciente} from '../controllers/pacienteController.js'
import checkAuth from '../middleware/autMiddleware.js'

router
    .route('/')
    .post(checkAuth, agregarpaciente)
    .get(checkAuth, obtenerpacientes)
    
router
    .route("/:id")
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router