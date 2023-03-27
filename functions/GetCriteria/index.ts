import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Criterion } from "../sequelize/models/models";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const criteria = await Criterion.findAll();
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