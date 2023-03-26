import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import seq from "../lib/sequelize";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    try {
        await seq.authenticate();
        context.res = {
            body: 'Connection has been established successfully.'
        };
      } catch (error) {
        context.res = {
            status: 500,
            body: error
        }
        console.error('Unable to connect to the database:', error);
      }

};

export default httpTrigger;