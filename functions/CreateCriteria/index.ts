import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import prisma from "../lib/prisma";
import {connect, query, config} from 'mssql'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    try {
        //const criteria = await prisma.criteria.create({data: {name, description: 'Az első szempont', minValue: 0, maxValue: 3, weight: 100}})
        const config: config = {user: 'sa', password: process.env.DATABASE_URL, database: 'pontozo-db', server: 'pontozo-db-server.database.windows.net',port: 1433,
    options: {trustServerCertificate: true}}
        await connect(config)
        const b = await query("SELECT 1")
        context.log('Query executed!')
        context.res = {
            body: b
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