# Pontoz-O

This is the repository of Pontoz-O, an application to rate Hungarian orienteering events developed in collaboration with the Hungarian Orienteering Federation (MTFSZ). The repository was created with Nx and it's made of three packages:

- Functions: The backend of the application, which is an Azure Function App written in TypeScript with the Node programming model v4.
- Client: The React frontend of the application.
- Common: Common types and util functions of the two main packages.

## Local development

The setup for local development is time-consuming and requires access to some resources of the MTFSZ that are not public.

You'll need the following applications:

- [VS Code](https://code.visualstudio.com/) with the [Azure Functions extension v1.10.4 or above](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) and the [Nx Console extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
- [Node.js 20.x or above](https://nodejs.org/en)
- [Azure Functions Core Tools v4.0.5382 or above](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#windows)
- [Azurite VS Code extension](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite)

You'll need to be able to connect to the following services:

- Azure SQL or Microsoft SQL Server database
- Redis
- Azure API Management
- MTFSZ SSO (not publically available)

Next, create a `local.settings.json` file in `/packages/functions`.
Fill with the following values:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "APIM_HOST": "<URL of your API Management instance>",
    "APIM_KEY": "<subscription key for your APIM instance>",
    "CLIENT_ID": "<client id of your registered app at MTFSZ SSO>",
    "CLIENT_SECRET": "<client secret of your registered app at MTFSZ SSO>",
    "MTFSZ_API_HOST": "https://adatbank2.mtfsz.hu",
    "JWT_SECRET": "a very secret value dont share it with anyone",
    "ADMINS": "<array of MTFSZ users that the seed function will set as admin (optional)>",
    "WEBSITE_RUN_FROM_PACKAGE": "1",
    "REDIS_HOST": "<host url of your redis instance>",
    "REDIS_PORT": "<port of your redis instance>",
    "REDIS_PWD": "<password of your redis instance>",
    "DB_SERVER": "<host of your database server>",
    "DB_NAME": "<database name of your database>",
    "DB_USER": "<user (with datareader and datawriter roles) of your database>",
    "DB_PWD": "<password of your user>",
    "DB_ADMIN_USER": "<user (with database admin role) of your database>",
    "DB_ADMIN_PWD": "<password of your admin user>"
  },
  "Host": {
    "LocalHttpPort": 3000,
    "CORS": "*"
  }
}
```

Next, create a `.env` file in `/packages/client` with the following content:

```
VITE_CLIENT_ID=<client id of your registered app at MTFSZ SSO>
VITE_APIM_KEY=<subscription key for your APIM instance>
PORT=3001
VITE_MTFSZ_API_URL=https://adatbank2.mtfsz.hu
```

Then start the Azurite Storage Emulator. You can do this in VS Code by pressing F1 and selecting the `Azurite: Start` task.

Next, install the dependencies:

```
npm i
cd packages/common
npm i
cd ../functions
npm i
```

Finally, start the frontend and backend with Nx (in separate terminals):

```
nx run functions:start
nx run client:serve
```
