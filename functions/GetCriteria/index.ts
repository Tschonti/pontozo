import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {AppDataSource} from "../lib/typeorm/config";
import Criterion, {  } from "../lib/typeorm/entities/Criterion";
import { criterionRepo } from "../lib/typeorm/repositories";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const criteria = await criterionRepo.find()
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