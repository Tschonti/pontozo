import { EmailClient, EmailMessage, KnownEmailSendStatus } from '@azure/communication-email'
import { InvocationContext } from '@azure/functions'
import { EmailRecipient } from '@pontozo/common'
import Event from '../typeorm/entities/Event'
import { ACS_CONNECTION_STRING } from '../util/env'

const POLLER_WAIT_TIME = 5

export const sendEventImportEmail = async (recipient: EmailRecipient, events: Event[], context: InvocationContext): Promise<boolean> => {
  if (events.length === 0) return true
  try {
    const message: EmailMessage = {
      senderAddress: '<donotreply@pontozo-notification.mtfsz.hu>',
      content: {
        subject: '[Pontoz-O] Új értékelhető versenyek!',
        html: `
          <html>
            <body>
              <h1>Új értékelhető versenyek!</h1>
              <ul>
              ${events.map((e) => `<li><a href="https://pontozo.mtfsz.hu/events/${e.id}">${e.name}</a></li>`).join(' ')}
              </ul>
              <a href="https://pontozo.mtfsz.hu/">Osszes ertekelheto verseny</a>
            </body>
          </html>
        `,
      },
      recipients: {
        to: [
          {
            address: recipient.email,
          },
        ],
      },
    }
    const client = new EmailClient(ACS_CONNECTION_STRING)
    const poller = await client.beginSend(message)

    if (!poller.getOperationState().isStarted) {
      context.error(`Poller was not started while sending email to User #${recipient.userId}`)
      return false
    }

    let timeElapsed = 0
    while (!poller.isDone()) {
      poller.poll()

      await new Promise((resolve) => setTimeout(resolve, POLLER_WAIT_TIME * 1000))
      timeElapsed += 10

      if (timeElapsed > 18 * POLLER_WAIT_TIME) {
        context.error(`Polling timed out while sending email to User #${recipient.userId}`)
        return false
      }
    }

    if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
      return true
    } else {
      context.error(poller.getResult().error)
      return false
    }
  } catch (e) {
    context.error(e)
    return false
  }
}
