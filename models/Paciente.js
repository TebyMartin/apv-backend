import moongoose from 'mongoose'

const pacientesSchema = moongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: true
    },

    veterinario: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Veterinario'
    }

}, {
    timestamps: true
})

const Paciente = moongoose.model('Paciente', pacientesSchema)

export default Paciente
