import { EmailClient, EmailMessage, KnownEmailSendStatus } from '@azure/communication-email'
import { InvocationContext } from '@azure/functions'
import { AlertLevel, EmailRecipient } from '@pontozo/common'
import * as ejs from 'ejs'
import * as path from 'path'
import Event from '../typeorm/entities/Event'
import { ACS_CONNECTION_STRING, ACS_EMAIL_SENDER } from '../util/env'
import { newAlertItem } from './alert.service'

const POLLER_WAIT_TIME = 5

export const sendEventImportEmail = async (recipient: EmailRecipient, events: Event[], context: InvocationContext): Promise<void> => {
  if (events.length === 0) return
  sendEmail(recipient, 'Új értékelhető versenyek!', await renderEmail('eventsImported', { events }), context)
}

export const sendResultsReadyEmail = async (recipient: EmailRecipient, events: Event[], context: InvocationContext): Promise<void> => {
  if (events.length === 0) return
  sendEmail(recipient, 'Új értékelési eredmények kerültek publikálásra!', await renderEmail('resultsPublished', { events }), context)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderEmail = async (templateName: 'eventsImported' | 'resultsPublished', data: any): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    ejs.renderFile(
      path.join(__dirname, '..', 'templates', `${templateName}.ejs`),
      data,
      { views: [path.join(__dirname, '..', 'templates')] },
      (err, html) => {
        if (err) {
          reject(err)
        } else {
          resolve(html)
        }
      }
    )
  })
}

const sendEmail = async (recipient: EmailRecipient, subject: string, content: string, context: InvocationContext): Promise<void> => {
  const message: EmailMessage = {
    senderAddress: ACS_EMAIL_SENDER,
    content: {
      subject: `[Pontoz-O] ${subject}`,
      html: content,
    },
    recipients: {
      to: [
        {
          address: recipient.email,
        },
      ],
    },
  }
  const client = new EmailClient(ACS_CONNECTION_STRING, {
    additionalPolicies: [
      {
        policy: catch429Policy(context),
        position: 'perRetry',
      },
    ],
  })
  const poller = await client.beginSend(message)

  if (!poller.getOperationState().isStarted) {
    context.error(`Poller was not started while sending email to User #${recipient.userId}`)
    return
  }

  let timeElapsed = 0
  while (!poller.isDone()) {
    poller.poll()

    await new Promise((resolve) => setTimeout(resolve, POLLER_WAIT_TIME * 1000))
    timeElapsed += POLLER_WAIT_TIME

    if (timeElapsed > 18 * POLLER_WAIT_TIME) {
      context.error(`Polling timed out while sending email to User #${recipient.userId}`)
      return
    }
  }

  if (poller.getResult().status !== KnownEmailSendStatus.Succeeded) {
    context.error(poller.getResult().error)
  }
}

const catch429Policy = (context: InvocationContext) => ({
  name: 'catch429Policy',
  async sendRequest(request, next) {
    const response = await next(request)
    if (response.status === 429) {
      await newAlertItem({ context, desc: 'Email sending quota reached', level: AlertLevel.WARN })
    }
    return response
  },
})
