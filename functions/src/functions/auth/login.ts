import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import * as jwt from 'jsonwebtoken'
import { getToken, getUser } from '../../service/mtfsz.service'
import UserRoleAssignment from '../../typeorm/entities/UserRoleAssignment'
import { getAppDataSource } from '../../typeorm/getConfig'
import { FRONTEND_URL, JWT_SECRET } from '../../util/env'

export const login = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const authorizationCode = req.query.get('code')
  if (!authorizationCode) {
    return {
      status: 401,
      body: 'Authentication failed'
    }
  }

  try {
    const oauthToken = await getToken(authorizationCode)
    const user = await getUser(oauthToken.access_token)

    const roles = await (await getAppDataSource()).getRepository(UserRoleAssignment).find({ where: { userId: user.szemely_id } })
    const jwtToken = jwt.sign({ ...user, roles: roles.map((r) => r.role) }, JWT_SECRET, { expiresIn: '2 days' })
    return {
      status: 302,
      headers: {
        location: `${FRONTEND_URL}/authorized?token=${jwtToken}`
      }
    }
    /*
    const html = `<html>
    <head></head>
    <body>
      <script>
        window.addEventListener("message", function (event) {
          if (event.data.message === "requestResult") {
            event.source.postMessage({"message": "deliverResult", result: "${jwtToken}" }, "*");
          }
        });
      </script>
    </body>
    </html>`
    return {
      body: html,
      headers: {
        'Content-Type': 'text/html'
      }
    }*/
  } catch (e) {
    return {
      status: 401,
      jsonBody: e
    }
  }
}

app.http('auth-login', {
  methods: ['GET'],
  route: 'auth/callback',
  handler: login
})
