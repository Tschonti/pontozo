import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {AppDataSource} from "../lib/typeorm/config";
import { Criterion } from "../lib/typeorm/entities/Criterion";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = context.bindingData.id as number
    if (isNaN(id)) {
        context.res = {
            status: 400,
            body: 'Invalid id!'
        }
        return
    }
    try {
        const criteria = await AppDataSource.manager.findOneBy(Criterion, {id})
        if (!criteria) {
            context.res = {
                status: 404,
                body: 'Criterion not found!'
            }
            return
        }
        context.res = {
            body: criteria
        };
      } catch (error) {
        context.res = {
            status: 500,
            body: error
        }
      }
};

export default httpTrigger;