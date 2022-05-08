import { Request, Response, NextFunction, Router, response } from "express";
import SubCuentas, { ISubCuentas } from "../models/SubCuentas";
import Cuenta from "../models/Cuentas";
import Auxiliares from "../models/Auxiliares";
import { authenticate } from "../middleware/veryfy";




class SubCuentasRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async listarAuxiliar (req: Request, res: Response): Promise<void>{
    try{
        const lista = await SubCuentas.find();
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
      const subcuentas = req.body.subcuentas;
      const nombre = req.body.nombre;

      //   console.log(req.verifiedUser)

       const subCuentacrear: ISubCuentas = new SubCuentas({
        userId: verifie._id,
        empresaId,
        subcuentas,
        nombre
      });

     const creacionSubCuebta = await subCuentacrear.save();

     const cuentaActualizado = await Cuenta.findByIdAndUpdate(
       id,
       {
         $push: { subcuentas: creacionSubCuebta._id },
       },
       { new: true }
     );

     console.log(cuentaActualizado)

      res.status(200).json(cuentaActualizado);
    } catch (err) {
      console.log(err);
      res.status(500).json('no se ha guardado revisa lo que enviaste')
    }
  }

  async asignarAuxiliar (req: Request, res: Response): Promise<void>{
    const { id } = req.params;
    const { auxiliar } = req.body;

    const cuentaActualizado = await SubCuentas.findByIdAndUpdate(
      id,
      {
        $push: { auxiliares: auxiliar },
      },
      { new: true }
    );
    res.json(cuentaActualizado);
  }

  async actualizarAuxiliares(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auxiliar = await SubCuentas.findByIdAndUpdate(id, req.body, { new: true });
    res.json(auxiliar);
  }

  async borrarTodo (req: Request, res: Response): Promise<void>{
    const { id } = req.params;
     await SubCuentas.deleteMany({userId: req.verifiedUser._id, empresaId: id});
    res.json('ready');
  }

  routes() {
    this.router.get('/listarsubcuenta', [authenticate], this.listarAuxiliar);
    // this.router.get('/:id', this.getUser);
    this.router.post("/crearsubcuenta/:id", [authenticate], this.crear);
    this.router.put('/actualizarsubcuenta/:id', [authenticate], this.actualizarAuxiliares);
    this.router.delete('/borrarsubcuentas/:id', [authenticate], this.borrarTodo);
  }
}

const subcuentas = new SubCuentasRouter();
export default subcuentas.router;