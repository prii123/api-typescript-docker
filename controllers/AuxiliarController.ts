import { Request, Response, NextFunction, Router, response } from "express";
import Auxiliares, { IAuxiliares } from "../models/Auxiliares";
import { authenticate } from "../middleware/veryfy";
import User from "../models/User";
import SubCuentas from "../models/SubCuentas";


class AuxiliarRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async listarAuxiliar (req: Request, res: Response): Promise<void>{
    try{
        const lista = await Auxiliares.find();
        res.status(200).json(lista)
    }catch(err){
        console.log(err)
    }
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const verifie = req.verifiedUser;
      const empresaId = req.body.empresaId;
      const auxiliares = req.body.auxiliares;
      const nombre = req.body.nombre;
      const tercero = req.body.tercero
      const saldo = req.body.saldo;

      //   console.log(req.verifiedUser)

       const claseCuenta: IAuxiliares = new Auxiliares({
        userId: verifie._id,
        empresaId,
        auxiliares,
        nombre,
        tercero,
        saldo,
      });

     const creadoAuxiliar = await claseCuenta.save();


  
 
     const cuentaActualizado = await SubCuentas.findByIdAndUpdate(
       id,
       {
         $push: { auxiliares: creadoAuxiliar._id },
       },
       { new: true }
     );

      res.status(200).json(cuentaActualizado);
    } catch (err) {
      console.log(err);
      res.status(500).json('has enviado un valor erroneo')
    }
  }

  async actualizarAuxiliares(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auxiliar = await Auxiliares.findByIdAndUpdate(id, req.body, { new: true });
    res.json(auxiliar);
  }

  async borrarTodo (req: Request, res: Response): Promise<void>{
    const { id } = req.params;
     await Auxiliares.deleteMany({userId: req.verifiedUser._id, empresaId: id});
    res.json('ready');
  }

  routes() {
    this.router.get('/listarauxiliar', [authenticate], this.listarAuxiliar);
    // this.router.get('/:id', this.getUser);
    this.router.post("/crearauxiliar/:id", [authenticate], this.crear);
    this.router.put('/actualizarauxiliar/:id', [authenticate], this.actualizarAuxiliares);
    this.router.delete('/borrarauxiliares/:id', [authenticate], this.borrarTodo);
  }
}

const userRouter = new AuxiliarRouter();
export default userRouter.router;