import { Request, Response, NextFunction, Router, response } from "express";
import Clase, { IClases } from "../models/Clases";
import { authenticate } from "../middleware/veryfy";




class ClasesRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async listar (req: Request, res: Response): Promise<void>{
    try{
        const lista = await Clase.find()
        .populate([{   // nivel 1  grupos
          path: 'grupos',
          model: 'Grupos',
          populate:{ // nivel 2 cuentas
            path: 'cuentas',
            model: 'Cuentas',
            populate:{ // nivel 3 sub cuentas
              path:'subcuentas',
              model:'SubCuentas',
              populate:{ // nivel 4 auxiliares
                path:'auxiliares',
                model:'Auxiliares'
              }
            }

          }
      }])

  

      //  console.log(lista)
        res.status(200).json(lista)




    }catch(err){
        console.log(err)
    }
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const verifie = req.verifiedUser;
      const empresaId = req.body.empresaId;
      const clase = req.body.clase;
      const nombre = req.body.nombre;

      //   console.log(req.verifiedUser)

       const claseCuenta: IClases = new Clase({
        userId: verifie._id,
        empresaId,
        clase,
        nombre,
      });

     await claseCuenta.save();

      res.status(200).json("listo");
    } catch (err) {
      console.log(err);
      res.status(500).json('hay un error, revisa si estas enviando valores validos')
    }
  }

  async asignarGrupos(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { grupos } = req.body;

    const grupoActualizado = await Clase.findByIdAndUpdate(
      id,
      {
        $push: { grupos: grupos },
      },
      { new: true }
    );
    res.json(grupoActualizado);


  }

  async borrarTodo (req: Request, res: Response): Promise<void>{
    const { id } = req.params;
     await Clase.deleteMany({userId: req.verifiedUser._id, empresaId: id});
    res.json('ready');
  }

  routes() {
    this.router.get('/listarclases', [authenticate], this.listar);
    // this.router.get('/:id', this.getUser);
    this.router.post("/crearclases", [authenticate], this.crear);
    this.router.put('/actualizarclases/:id', [authenticate], this.asignarGrupos);
    this.router.delete('/borrarclases/:id', [authenticate], this.borrarTodo);
  }
}

const ClasesRout = new ClasesRouter();
export default ClasesRout.router;