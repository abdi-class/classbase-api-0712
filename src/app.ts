import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";

const PORT: string = process.env.PORT || "8181";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Classbase API</h1>");
    });
  }

  private errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.log(error);
        res.status(error.code || 500).send(error);
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API Running: http://localhost:${PORT}`);
    });
  }
}

export default App;
