import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import prisma from "../lib/prisma";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(prisma)
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    try {
        //const criteria = await prisma.criteria.create({data: {name, description: 'Az első szempont', minValue: 0, maxValue: 3, weight: 100}})
        context.log('Query executed!')
        context.res = {
            body: name
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