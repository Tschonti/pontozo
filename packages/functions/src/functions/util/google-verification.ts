import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import * as fs from 'fs'
import * as path from 'path'

export const googleVerification = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const filePath = path.join(__dirname, 'google8bc4d33afc7bc848.html')
  const htmlContent = fs.readFileSync(filePath, 'utf8')
  return {
    status: 200,
    body: htmlContent,
    headers: {
      'Content-Type': 'text/html',
    },
  }
}

app.http('google-verification', {
  methods: ['GET'],
  route: 'google8bc4d33afc7bc848.html',
  handler: googleVerification,
})
