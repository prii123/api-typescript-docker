import { Request, Response, NextFunction, Router, response } from "express";
import { authenticate } from "../middleware/veryfy";
import User from "../models/User";
import HojaVida, { IHojaVida } from "../models/HojaVida";

class SubCuentasRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async usuario(req: Request, res: Response): Promise<void> {
    const id = req.verifiedUser._id;
    const query = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // console.log(query)
    res.json(query);
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auxiliar = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(auxiliar);
  }

  async crearHojaVida(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      console.log(data);

      if (!req.verifiedUser)
        throw new Error("You must be logged in to do that");
      const userFound = await User.findById(req.verifiedUser._id);
      // console.log(req.verifiedUser);
      if (!userFound) throw new Error("Unauthorized");

      const creacion: IHojaVida = new HojaVida({
        userId: req.verifiedUser._id,
        nombre: data.nombre,
        fechaDeNacimiento: data.fechaDeNacimiento,
        lugarNacimiento: data.lugarNacimiento,
        telefono: data.telefono,
        correo: data.correo,
        lugarDeNacimiento: data.lugarDeNacimiento,
        genero: data.genero,
        estadoCivil: data.estadoCivil,
        foto: data.foto,
        linkending: data.linkending,
        descripcion: data.descripcion,
        formacion: data.formacion && data.formacion,
        experiencia: data.experiencia && data.experiencia,
        skills: data.skills && data.skills,
      });
      const guardar = creacion.save();


        // AGREGA EL ID DE LA HOJA DE VIDA A EL USUARIO AL QUE PERTENECE

      const cuentaActualizado = await User.findByIdAndUpdate(
        req.verifiedUser,
        {
          $push: { hojaVida: (await guardar)._id },
        },
        { new: true }
      );



      res.status(200).json("guardado");
    } catch (error) {
      console.log(error);
      res.status(500).json("hay un error");
    }
  }

  async actualizarHojaVida(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      // console.log(data);

      if (!req.verifiedUser)
        throw new Error("You must be logged in to do that");
      const userFound = await User.findById(req.verifiedUser._id);
      // console.log(req.verifiedUser);
      if (!userFound) throw new Error("Unauthorized");

      const creacion = await HojaVida.findOneAndUpdate({userId: req.verifiedUser._id},{
        nombre: data.nombre,
        fechaDeNacimiento: data.fecha,
        lugarNacimiento: data.lugarNacimiento,
        telefono: data.telefono,
        correo: data.correo,
        lugarDeNacimiento: data.lugarDeNacimiento,
        genero: data.genero,
        estadoCivil: data.estadoCivil,
        foto: data.foto,
        linkending: data.linkending,
        descripcion: data.descripcion,
        formacion: data.formacion && data.formacion,
        experiencia: data.experiencia && data.experiencia,
        skills: data.skills && data.skills,
      });

      res.status(200).json(creacion);
    } catch (error) {
      console.log(error);
      res.status(500).json("hay un error");
    }
  }

  async hojasVida(req:Request, res: Response): Promise<void>{
    
    const hojas = await HojaVida.find();

    res.json(hojas);
  }

  async hojaVida(req:Request, res: Response): Promise<void>{
    if (!req.verifiedUser)
        throw new Error("You must be logged in to do that");
    const hojas = await HojaVida.find({userId: req.verifiedUser._id});

    res.json(hojas);
  }

  routes() {
    this.router.put("/actualizarusuario/:id", [authenticate], this.actualizar);
    this.router.get("/user", [authenticate], this.usuario);
    this.router.post("/hojadevida", [authenticate], this.crearHojaVida);
    this.router.get("/hojadevida", this.hojasVida);
    this.router.get("/hojavida", [authenticate], this.hojaVida);
    this.router.put("/hojadevida", [authenticate], this.actualizarHojaVida);
  }
}

const subcuentas = new SubCuentasRouter();
export default subcuentas.router;
