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

  async listarAuxiliar(req: Request, res: Response): Promise<void> {
    try {
      const lista = await Auxiliares.find();
      res.status(200).json(lista);
    } catch (err) {
      console.log(err);
    }
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const verifie = req.verifiedUser;
      const empresaId = req.body.empresaId;
      const auxiliares = req.body.auxiliares;
      const nombre = req.body.nombre;
      const tercero = req.body.tercero;
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
      res.status(500).json("has enviado un valor erroneo");
    }
  }

  async crearMasivo(req: Request, res: Response): Promise<void> {
    try {
      // const { id } = req.params;
      const data = req.body;
      const empresaId = data.empresaId;
      const verifie = req.verifiedUser;
      // console.log(data)
      if (data.auxiliar) {
        data.auxiliar.map(async (aux: any) => {
         
          const clase = aux.clase;
          const grupo = aux.grupo;
          const cuenta = aux.cuenta;
          const subcuenta = aux.subcuenta;
          const auxiliares = aux.auxiliares;
          const nombre = aux.nombre;
          const tercero = aux.tercero;
          const saldo = aux.saldo;

          const busquedaDelaSubcuenta = await SubCuentas.find({
            subcuentas: subcuenta, empresaId: empresaId
          });
          // console.log(busquedaDelaSubcuenta)
          if (busquedaDelaSubcuenta[0]) {
            const id = busquedaDelaSubcuenta[0]._id;

            const auxiliaresss: IAuxiliares = new Auxiliares({
              userId: verifie._id,
              empresaId,
              clase,
              grupo,
              cuenta,
              subcuenta,
              auxiliares,
              nombre,
              tercero,
              saldo,
            });

            const creadoAuxiliar = await auxiliaresss.save();
            // console.log(creadoAuxiliar)
            const cuentaActualizado = await SubCuentas.findByIdAndUpdate(
              id,
              {
                $push: { auxiliares: creadoAuxiliar._id },
              },
              { new: true }
            );
            console.log(cuentaActualizado)
          }
        });
      }

      //   console.log(req.verifiedUser)

      res.status(200).json("cuentaActualizado");
    } catch (err) {
      console.log(err);
      res.status(500).json("has enviado un valor erroneo");
    }
  }

  async actualizarAuxiliares(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auxiliar = await Auxiliares.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(auxiliar);
  }

  async borrarTodo(req: Request, res: Response): Promise<void> {
    // const { id } = req.params;
    const empresaId = req.body.empresaId;
    // console.log(empresaId)
    await Auxiliares.deleteMany({
      empresaId: empresaId,
    });
    res.json("ready");
  }

  routes() {
    this.router.get("/listarauxiliar", [authenticate], this.listarAuxiliar);
    // this.router.get('/:id', this.getUser);
    this.router.post("/crearauxiliar/:id", [authenticate], this.crear);
    this.router.post(
      "/crearauxiliarmasivo",
      [authenticate],
      this.crearMasivo
    );
    this.router.put(
      "/actualizarauxiliar/:id",
      [authenticate],
      this.actualizarAuxiliares
    );
    this.router.delete(
      "/borrarauxiliares",
      [authenticate],
      this.borrarTodo
    );
  }
}

const userRouter = new AuxiliarRouter();
export default userRouter.router;
