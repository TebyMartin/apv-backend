import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarId from "../helpers/generarId.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emialOlvidePassword from "../helpers/emialOlvidePassword.js"

const registrar = async (req, res) => {
   const {email, nombre } = req.body

    //prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({ email })
    
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado ')
        return res.status(400).json({msg: error.message})
    }
    try {
        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterianarioGuardado = await veterinario.save()
        //enviar el email puede ser que haya un error por eso en ese lugar ya se agrego el registro
        emailRegistro({
            email,
            nombre,
            token:veterianarioGuardado.token
        })

        res.json(veterianarioGuardado)
    } catch (error) {
        console.log(error);
    }
    

}

const perfil = (req, res) => {

    const {veterinario} = req 
    
    res.json(veterinario)
}

const confirmar = async (req, res) => {
    const { token } = req.params;

    console.log(`Token recibido: ${token}`); 
  
    const usuarioConfirmar = await Veterinario.findOne({ token });
  
    if (!usuarioConfirmar) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }
  
    try {
      usuarioConfirmar.token = null;
      usuarioConfirmar.confirmado = true;
      await usuarioConfirmar.save();
  
      res.json({ msg: "Usuario Confirmado Correctamente" });
    } catch (error) {
      console.log(error);
    }
  };
  

const autenticar = async (req, res) => {
    const { email, password } = req.body
    
    //comprobar si el usuario existe 
    const usuario = await Veterinario.findOne({ email })
    
    if (!usuario) {
        const error = new Error("el usuario no existe");
        return res.status(404).json({ msg: error.message });
    }
    
    //comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }

    //revisar el password

    if (await usuario.comprobarPassword(password)) {
        //autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
           token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error('El password es incorrecto')
        return res.status(403).json({msg: error.message})
    }

    
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({ email });

    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()
        //enviar email con instrucciones
        emialOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error);
    }

}
const comprobarToken = async (req, res) => {
    const {token} = req.params  //req.body informacion de un formulario y req.params es de la url
    const tokenValido = await Veterinario.findOne({ token })
    if (tokenValido) {
        //el token es valido el usuario existe
        res.json({msg:'token valido y el usuario existe'})
    } else {
        const error = new Error('token no valido');
        return res.status(400).json({ msg: error.message });
    }
}
const nuevoPassword = async (req, res) => {
    
    const { token } = req.params 
    const { password } = req.body
    const veterinario = await Veterinario.findOne({ token }) 
    if (!veterinario) {
        const error = new Error('hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null 
        veterinario.password = password
        await veterinario.save()
        res.json ({msg: "password modificado correctamente"})
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body;
  if (veterinario.email !== req.body.email) {
    const existeEmail = await Veterinario.findOne({ email });

    if (existeEmail) {
      const error = new Error("Ese email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterianrioActualizado = await veterinario.save();
    res.json(veterianrioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
    //leer los datos
    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body
    

    //comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }
    //comprarbar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        //almacenar el nuevo password
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({msg:'Password Almacenado Correctamente'})
    } else {
        const error = new Error("El password actual es incorrecto");
        return res.status(400).json({ msg: error.message });
    }
    
}

export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil,actualizarPassword }
