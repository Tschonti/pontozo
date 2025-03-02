import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email'
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { ACS_CONNECTION_STRING } from '../util/env'

export const sendEmail = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const POLLER_WAIT_TIME = 10
  try {
    const message = {
      senderAddress: '<donotreply@pontozo-notification.mtfsz.hu>',
      content: {
        subject: 'Welcome to Azure Communication Services Email',
        plainText: 'This email message is sent from Azure Communication Services Email using the JavaScript SDK.',
      },
      recipients: {
        to: [
          {
            address: '<feketesamu@gmail.com>',
          },
        ],
      },
    }
    const client = new EmailClient(ACS_CONNECTION_STRING)
    const poller = await client.beginSend(message)

    if (!poller.getOperationState().isStarted) {
      throw 'Poller was not started.'
    }

    let timeElapsed = 0
    while (!poller.isDone()) {
      poller.poll()
      console.log('Email send polling in progress')

      await new Promise((resolve) => setTimeout(resolve, POLLER_WAIT_TIME * 1000))
      timeElapsed += 10

      if (timeElapsed > 18 * POLLER_WAIT_TIME) {
        throw 'Polling timed out.'
      }
    }

    if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
      console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`)
    } else {
      throw poller.getResult().error
    }
    return {
      status: 204,
    }
  } catch (e) {
    console.log(e)
  }
}

app.http('sendEmail', {
  methods: ['GET'],
  route: 'sendEmail',
  handler: sendEmail,
})
