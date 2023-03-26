import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import seq from "../sequelize/config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const alter = !!req.query?.alter
        await seq.sync({alter})
        context.res = {
            body: 'Schema synced!'
        }
    } catch (e) {
        context.res = {
            status: 500,
            body: e
        }
    }

};

export default httpTrigger;