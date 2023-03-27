import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {AppDataSource} from "../lib/typeorm/config";
import { Rating } from "../lib/typeorm/entities/Rating";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (!req.body) {
        context.res = {
          status: 400,
          body: { message: `No body attached to POST query.` }
        }
        return
      }
    try {
        const rating = await AppDataSource.createQueryBuilder().insert().into(Rating).values(req.body).execute()

        context.res = {
            body: rating.raw
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