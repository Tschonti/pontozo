import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {connect, query, config} from 'mssql'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    try {
        //const configAzure: config = {user: 'dbadmin', password: process.env.DATABASE_URL, database: 'pontozo-db', server: 'pontozo-db-server.database.windows.net',port: 1433, options: {trustServerCertificate: true}}
        const configLocal: config = {user: process.env.DB_USER, password: process.env.DB_PWD, database: 'pontozo-db', server: process.env.DB_SERVER,port: 1433, options: {trustServerCertificate: true}}
        await connect(configLocal)
        const b = await query("SELECT * FROM Criteria;")
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