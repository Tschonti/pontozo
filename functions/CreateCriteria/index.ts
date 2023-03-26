import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    try {
        //const criteria = await prisma.criteria.create({data: {name, description: 'Az első prisma szempont', minValue: 0, maxValue: 3, weight: 100}})
        // const config: config = {user: process.env.DB_USER, password: process.env.DB_PWD, database: 'pontozo-db', server: process.env.DB_SERVER ,port: 1433, options: {trustServerCertificate: true}}
        // await connect(config)
        // const b = await query(`INSERT INTO Criteria ("name", "description", "minValue", "maxValue", "weight") VALUES ('${name}', 'proba', 1, 3, 10)`)
        // context.log('Query executed!')
        context.res = {
            body: 'a'
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