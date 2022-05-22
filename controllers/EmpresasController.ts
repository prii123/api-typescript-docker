import { Request, Response, NextFunction, Router, response } from "express";
import Empresa, { IEmpresa } from "../models/Empresa";
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

  routes() {
    this.router.post('/buscarEmpresas', [authenticate], this.listarEmpresas);
    this.router.post('/buscarempresa', [authenticate], this.empresa);
  }
}

const EmpresasR = new EmpresasRouter();
export default EmpresasR.router;