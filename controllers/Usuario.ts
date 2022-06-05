import { Request, Response, NextFunction, Router, response } from "express";
import { authenticate } from "../middleware/veryfy";
import User from "../models/User";

class SubCuentasRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  async usuario(req: Request, res: Response): Promise<void> {
    const id = req.verifiedUser._id;
    const query = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(query)
    res.json(query);
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auxiliar = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(auxiliar);
  }


  routes() {

    this.router.put(
      "/actualizarusuario/:id",
      [authenticate],
      this.actualizar
    );
    this.router.get(
      "/user",
      [authenticate],
      this.usuario
    );
  }
}

const subcuentas = new SubCuentasRouter();
export default subcuentas.router;