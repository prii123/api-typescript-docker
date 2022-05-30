import { Request, Response, NextFunction, Router, response } from "express";
import { authenticate } from "../middleware/veryfy";
import User from "../models/User";

class SubCuentasRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }


  async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auxiliar = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(auxiliar);
  }

  routes() {
    // this.router.get("/listarsubcuenta", [authenticate], this.listarAuxiliar);
    this.router.put(
      "/actualizarusuario/:id",
      [authenticate],
      this.actualizar
    );
  }
}

const subcuentas = new SubCuentasRouter();
export default subcuentas.router;