import { Request, Response, NextFunction, Router, response } from "express";
import Grupo, { IGrupos } from "../models/Grupos";
import Clase from "../models/Clases";
import { authenticate } from "../middleware/veryfy";


class GruposRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const lista = await Grupo.find();
      res.status(200).json(lista);
    } catch (err) {
      console.log(err);
    }
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const verifie = req.verifiedUser;
      const empresaId = req.body.empresaId;
      const grupo = req.body.grupo;
      const nombre = req.body.nombre;
      const { id } = req.params;

      //   crea un grupo del puc
      const claseCuenta: IGrupos = new Grupo({
        userId: verifie._id,
        empresaId,
        grupo,
        nombre,
      });
      // guarda la clase creada
      const responder = await claseCuenta.save();

      // despues de guardar el grupo se llama el nivel superior yla clase y se actualiza el array de grupos tomando el ID
      // del grupo creado
      const grupoActualizado = await Clase.findByIdAndUpdate(
        id,
        {
          $push: { grupos: responder._id },
        },
        { new: true }
      );

      // console.log(grupoActualizado)

      //  if (!responder) res.status(500).json('no se ha guardado revisa lo que enviaste')

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
      if (data.grupos.length) {
        data.grupos.map(async (grup: any) => {
          const empresaId = "1085306970" //grup.empresaId; 
          const grupo = grup.grupo;
          const nombre = grup.nombre;
          const claseNumero = grup.clase;

          const busquedaDeLaCLase = await Clase.find({clase: claseNumero})
          // console.log(busquedaDeLaCLase)
          if(busquedaDeLaCLase[0]){
            // console.log(busquedaDeLaCLase[0]._id)
            const id = busquedaDeLaCLase[0]._id


            //   crea un grupo del puc
            const claseCuenta: IGrupos = new Grupo({
              userId: verifie._id,
              empresaId,
              grupo,
              nombre,
            });
            // guarda la clase creada
            const responder = await claseCuenta.save();

            // despues de guardar el grupo se llama el nivel superior yla clase y se actualiza el array de grupos tomando el ID
            // del grupo creado
            await Clase.findByIdAndUpdate(
              id,
              {
                $push: { grupos: responder._id },
              },
              { new: true }
            );
            }


        });
      }
    
      res.status(200).json("ok");

    
    } catch (err) {
      console.log(err);
      res.status(500).json("no se ha guardado revisa lo que enviaste");
    }
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auxiliar = await Grupo.findByIdAndUpdate(id, req.body, { new: true });
    res.json(auxiliar);
  }

  async borrarTodo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await Grupo.deleteMany({ userId: req.verifiedUser._id, empresaId: id });
    res.json("ready");
  }

  async asignarCuenta(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { cuenta } = req.body;

    const grupoActualizado = await Grupo.findByIdAndUpdate(
      id,
      {
        $push: { cuentas: cuenta },
      },
      { new: true }
    );
    res.json(grupoActualizado);
  }
  routes() {
    this.router.get("/listargrupos", [authenticate], this.listar);
    // this.router.get('/:id', this.getUser);
    this.router.post("/creargrupos/:id", [authenticate], this.crear);
    this.router.post(
      "/crearmasivogrupos",
      [authenticate],
      this.crearMasivo
    );
    this.router.put("/actualizargrupos/:id", [authenticate], this.actualizar);
    this.router.delete("/borrargrupos/:id", [authenticate], this.borrarTodo);
  }
}

const Grupos = new GruposRouter();
export default Grupos.router;
