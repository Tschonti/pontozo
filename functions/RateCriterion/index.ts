import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Rating } from "../sequelize/models/models";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (!req.body) {
        context.res = {
          status: 400,
          body: { message: `No body attached to POST query.` }
        }
        return
      }
    try {
        context.log(req.body)
        const rating = await Rating.create(req.body)
        context.res = {
            body: rating
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