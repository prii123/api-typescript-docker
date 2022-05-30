import { Request, Response, NextFunction, Router, response } from "express";
import Clase, { IClases } from "../models/Clases";
import Grupos from "../models/Grupos";
import Cuentas from "../models/Cuentas";
import SubCuentas from "../models/SubCuentas";
import { authenticate } from "../middleware/veryfy";
import Auxiliares from "../models/Auxiliares";

class ClasesRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const idEmpresa = req.body.dataId;
      // console.log(idEmpresa)
      const lista = await Clase.find({ empresaId: idEmpresa })
        .sort({ clase: 1 })
        .populate([
          {
            // nivel 1  grupos
            path: "grupos",
            model: "Grupos",
            populate: {
              // nivel 2 cuentas
              path: "cuentas",
              model: "Cuentas",
              populate: {
                // nivel 3 sub cuentas
                path: "subcuentas",
                model: "SubCuentas",
                // populate:{ // nivel 4 auxiliares
                //   path:'auxiliares',
                //   model:'Auxiliares'
                // }
              },
            },
          },
        ]);

      const auxiliares = await Auxiliares.find({ empresaId: idEmpresa });

      // METODOS DE REDUCCION PARA RESPONDER
      //saldo por clase de cuenta
      const saldoPorClase = auxiliares.reduce(
        (acumulador: any, valorActual: any) => {
          const elementoYaExiste = acumulador.find(
            (elemento: any) => elemento.clase === valorActual.clase
          );
          if (elementoYaExiste) {
            return acumulador.map((elemento: any) => {
              if (elemento.clase === valorActual.clase) {
                return {
                  ...elemento,
                  saldoTotal: elemento.saldo + valorActual.saldo,
                };
              }
              return elemento;
            });
          }

          const tot = {
            clase: valorActual.clase,
            saldo: valorActual.saldo,
          };

          //  console.log(tot);
          return [...acumulador, tot]; //[...acumulador, valorActual];
        },
        []
      );
      //saldo por grupo de cuentas
      const saldosPorGrupo = auxiliares.reduce(
        (acumulador: any, valorActual: any) => {
          const elementoYaExiste = acumulador.find(
            (elemento: any) => elemento.grupo === valorActual.grupo
          );
          if (elementoYaExiste) {
            return acumulador.map((elemento: any) => {
              if (elemento.grupo === valorActual.grupo) {
                return {
                  ...elemento,
                  saldoTotal: elemento.saldo + valorActual.saldo,
                };
              }
              return elemento;
            });
          }

          const tot = {
            grupo: valorActual.grupo,
            saldo: valorActual.saldo,
          };

          //  console.log(tot);
          return [...acumulador, tot]; //[...acumulador, valorActual];
        },
        []
      );
      //saldo por cueentas
      const saldosPorCuentas = auxiliares.reduce(
        (acumulador: any, valorActual: any) => {
          const elementoYaExiste = acumulador.find(
            (elemento: any) => elemento.cuenta === valorActual.cuenta
          );
          if (elementoYaExiste) {
            return acumulador.map((elemento: any) => {
              if (elemento.cuenta === valorActual.cuenta) {
                return {
                  ...elemento,
                  saldoTotal: elemento.saldo + valorActual.saldo,
                };
              }
              return elemento;
            });
          }

          const tot = {
            cuenta: valorActual.cuenta,
            saldo: valorActual.saldo,
          };

          //  console.log(tot);
          return [...acumulador, tot]; //[...acumulador, valorActual];
        },
        []
      );

      const valo_pasivo = saldoPorClase.filter((e: any) => e.clase == "2")[0]
        ?.saldoTotal;
      const valo_patrimonio = saldoPorClase.filter(
        (e: any) => e.clase == "3"
      )[0]?.saldoTotal;
      const pasivoMasPatrimonio = Math.round(valo_pasivo + valo_patrimonio);

      const valor_ingreso =
        saldoPorClase?.filter((e: any) => e.clase == "4")[0]?.saldoTotal || 0;
      const valor_gasto =
        saldoPorClase?.filter((e: any) => e.clase == "5")[0]?.saldoTotal || 0;
      const valor_costo =
        saldoPorClase?.filter((e: any) => e.clase == "6")[0]?.saldoTotal || 0;
      const valor_costoProduccion =
        saldoPorClase?.filter((e: any) => e.clase == "7")[0]?.saldoTotal || 0;
      const utilidad = Math.round(
        valor_ingreso - valor_gasto - valor_costo - valor_costoProduccion
      );
      const impuesto = Math.round((utilidad * 31) / 100);
      const utilidadDespuesDeImpuesto = Math.round(utilidad - impuesto);

      // console.log(valor_ingreso)
      const valores_adicionales = {
        pasivoMasPatrimonio,
        utilidad,
        impuesto,
        utilidadDespuesDeImpuesto,
      };
      // console.log(valores_adicionales)

      //  console.log(lista)
      res
        .status(200)
        .json({
          lista,
          saldoPorClase,
          saldosPorGrupo,
          saldosPorCuentas,
          valores_adicionales,
        });
    } catch (err) {
      console.log(err);
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

      // console.log(claseCuenta)

      await claseCuenta.save();

      res.status(200).json("listo");
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json("hay un error, revisa si estas enviando valores validos");
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

  async borrarTodo(req: Request, res: Response): Promise<void> {
    const empresaId = req.body.empresaId;
    await Clase.deleteMany({
      userId: req.verifiedUser._id,
      empresaId: empresaId,
    });
    await Grupos.deleteMany({
      userId: req.verifiedUser._id,
      empresaId: empresaId,
    });
    await Cuentas.deleteMany({
      userId: req.verifiedUser._id,
      empresaId: empresaId,
    });
    await SubCuentas.deleteMany({
      userId: req.verifiedUser._id,
      empresaId: empresaId,
    });
    await Auxiliares.deleteMany({
      userId: req.verifiedUser._id,
      empresaId: empresaId,
    });

    res.json("ready");
  }

  routes() {
    this.router.post("/listarclases", [authenticate], this.listar);
    // this.router.get('/:id', this.getUser);
    this.router.post("/crearclases", [authenticate], this.crear);
    this.router.put(
      "/actualizarclases/:id",
      [authenticate],
      this.asignarGrupos
    );
    this.router.delete("/borrarclases", [authenticate], this.borrarTodo);
  }
}

const ClasesRout = new ClasesRouter();
export default ClasesRout.router;
