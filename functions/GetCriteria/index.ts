import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import seq from "../sequelize/config";
import { Criterion } from "../sequelize/models/criterion";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
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