import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {AppDataSource} from "../lib/typeorm/config";
import  Rating  from "../lib/typeorm/entities/Rating";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = context.bindingData.id as number
    if (!req.body) {
        context.res = {
          status: 400,
          body: { message: `No body attached to POST query.` }
        }
        return
      }
    try {
        const rating = await AppDataSource.createQueryBuilder().insert().into(Rating).values({criterion: {id}, value: req.body.value}).execute()

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