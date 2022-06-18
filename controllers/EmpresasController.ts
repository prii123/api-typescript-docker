import { Request, Response, NextFunction, Router, response } from "express";
import Empresa, { IEmpresa } from "../models/Empresa";
import User, { IUser } from "../models/User";
import { authenticate } from "../middleware/veryfy";




class EmpresasRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }


  async listarEmpresas (req: Request, res: Response): Promise<void>{
    try{
        const valorBuscado = req.body.search.toLowerCase(   );
        const lista = await Empresa.find({razonSocial: {  $regex: valorBuscado  }})
        // console.log(lista)
        res.status(200).json(lista)
    }catch(err){
        console.log(err)
        res.json('hay un error')
    }
}

async empresa (req: Request, res: Response): Promise<void>{
  try{
      const id = req.body.id
      const data = await Empresa.findById(id)
      // console.log(id)
      res.status(200).json(data)
  }catch(err){
      console.log(err)
      res.json('hay un error')
  }
}

async empresaUpdate (req: Request, res: Response): Promise<void>{
  try{
      const id = req.body.id
      const img = req.body.logo
      // console.log(id +'----'+img)
      const data = await Empresa.findOneAndUpdate({_id: id}, { logo: img})
      // console.log(data)
      res.status(200).json(data)
  }catch(err){
      console.log(err)
      res.json('hay un error')
  }
}

async empresaCrear (req: Request, res: Response): Promise<void>{
  try{
      const args = req.body

      if (!req.verifiedUser) throw new Error("You must be logged in to do that");
    const userFound = await User.findById(req.verifiedUser._id);

    if (!userFound) throw new Error("Unauthorized");

    const post = new Empresa({
      creadorId: req.verifiedUser._id,
      razonSocial: args.razonSocial.toLowerCase(),
      body: args.body.toLowerCase(),
      nit: args.nit,
      digitoVerificacion: args.digitoVerificacion,
      direccion: args.direccion.toLowerCase(),
      ciudad: args.ciudad.toLowerCase(),
      logo: args.logo,
    });

    const data = post.save();
      
     res.status(200).json(data)
  }catch(err){
      console.log(err)
      res.json('hay un error')
  }
}

  routes() {
    this.router.post('/buscarEmpresas', [authenticate], this.listarEmpresas);
    this.router.post('/crearempresa', [authenticate], this.empresaCrear);
    this.router.post('/buscarempresa', [authenticate], this.empresa);
    this.router.post('/buscarempresaupdate', [authenticate], this.empresaUpdate);
  }
}

const EmpresasR = new EmpresasRouter();
export default EmpresasR.router;