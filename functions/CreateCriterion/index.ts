import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {AppDataSource} from "../lib/typeorm/config";
import { Criterion } from "../lib/typeorm/entities/Criterion";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (!req.body) {
        context.res = {
          status: 400,
          body: { message: `No body attached to POST query.` }
        }
        return
      }
    try {
        const criterion = await AppDataSource.createQueryBuilder().insert().into(Criterion).values(req.body).execute()

        context.res = {
            body: criterion.raw
        };
    } catch (e) {
        context.log(e)
        context.res = {
            status: 400,
            body: e
        }
    }

};

export default httpTrigger;