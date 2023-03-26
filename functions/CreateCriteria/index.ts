import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import seq from "../sequelize/config";
import { Criterion } from "../sequelize/models/criterion";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (!req.body) {
        context.res = {
          status: 400,
          body: { message: `No body attached to POST query.` }
        }
        return
      }
    try {
        //await seq.sync({alter: true})
        context.log(req.body)
        const criterion = await Criterion.create(req.body)
        context.res = {
            body: criterion
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