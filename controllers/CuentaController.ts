import { Request, Response, NextFunction, Router, response } from "express";
import Cuenta, { ICuentas } from "../models/Cuentas";
import Grupo from "../models/Grupos";
import { authenticate } from "../middleware/veryfy";

class CuentasRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async listarAuxiliar(req: Request, res: Response): Promise<void> {
    try {
      const lista = await Cuenta.find();
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
      const cuentas = req.body.cuentas;
      const nombre = req.body.nombre;

      //  se crea una cuenta tomando un id en la ruta

      const claseCuenta: ICuentas = new Cuenta({
        userId: verifie._id,
        empresaId,
        cuentas,
        nombre,
      });
      // se guarda la cuenta
      const creacionCuenta = await claseCuenta.save();

      // console.log(creacionCuenta)
      // actualizamos el grupo incertando las cuenta
      const grupoActualizado = await Grupo.findByIdAndUpdate(
        id,
        {
          $push: { cuentas: creacionCuenta._id },
        },
        { new: true }
      );

      res.status(200).json(grupoActualizado);
    } catch (err) {
      console.log(err);
      res.status(500).json("no se ha guardado revisa lo que enviaste");
    }
  }
  async crearMasivo(req: Request, res: Response): Promise<void> {
    try {
      const verifie = req.verifiedUser;
      // toma todo el objeto que viene en forma json
      const data = req.body;
      // utiliza el map para agregar uno por uno a la base de datos, como del front se envia un json formado por un excel
      //cada dato se procesara aqui
      // console.log(data.cuentass)
      if (data.cuentass)  {
        data.cuentass.map(async (grup: any) => {

          const empresaId = "1085306970"; //grup.empresaId; 
          const cuentas = grup.cuentas;
          const nombre = grup.nombre;
          const claseGrupo = grup.grupo;

         
            const busquedaDeLGrupo = await Grupo.find({ grupo: claseGrupo });
            // console.log(busquedaDeLaCLase) 
            if (busquedaDeLGrupo[0]) {
              // console.log(busquedaDeLGrupo[0]._id);
              const id = busquedaDeLGrupo[0]._id;

              const claseCuenta: ICuentas = new Cuenta({
                userId: verifie._id,
                empresaId,
                cuentas,
                nombre,
              });
              // se guarda la cuenta
              const creacionCuenta = await claseCuenta.save();

              // console.log(creacionCuenta)
              // actualizamos el grupo incertando las cuenta
              await Grupo.findByIdAndUpdate(
                id,
                {
                  $push: { cuentas: creacionCuenta._id },
                },
                { new: true }
              );
            }
       

        });
      }

      res.status(200).json("Ready");
    } catch (err) {
      console.log(err);
      res.status(500).json("no se ha guardado revisa lo que enviaste");
    }
  }

  async actualizarAuxiliares(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auxiliar = await Cuenta.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(auxiliar);
  }

  async borrarTodo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await Cuenta.deleteMany({ userId: req.verifiedUser._id, empresaId: id });
    res.json("ready");
  }

  async asignarSubCuenta(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { subcuenta } = req.body;

    const cuentaActualizado = await Cuenta.findByIdAndUpdate(
      id,
      {
        $push: { subcuenta: subcuenta },
      },
      { new: true }
    );
    res.json(cuentaActualizado);
  }

  routes() {
    this.router.get("/listarcuenta", [authenticate], this.listarAuxiliar);
    // this.router.get('/:id', this.getUser);
    this.router.post("/crearcuenta/:id", [authenticate], this.crear);
    this.router.post("/crearcuentamasivo", [authenticate], this.crearMasivo);
    this.router.put(
      "/actualizarcuenta/:id",
      [authenticate],
      this.actualizarAuxiliares
    );
    this.router.delete("/borrarcuentas/:id", [authenticate], this.borrarTodo);
  }
}

const Cuentas = new CuentasRouter();
export default Cuentas.router;
