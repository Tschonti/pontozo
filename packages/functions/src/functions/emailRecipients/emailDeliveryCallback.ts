import { app, EventGridEvent, InvocationContext } from '@azure/functions'
import { AlertLevel } from '@pontozo/common'
import { newAlertItem } from '../../service/alert.service'
import { EmailRecipient } from '../../typeorm/entities/EmailRecipient'
import { getAppDataSource } from '../../typeorm/getConfig'

enum EmailDeliveryStatus {
  Suppressed = 'Suppressed',
  Bounced = 'Bounced',
  Quarantined = 'Quarantined',
  FilteredSpam = 'FilteredSpam',
  Failed = 'Failed',
}

export async function emailDeliveryCallback(event: EventGridEvent, context: InvocationContext): Promise<void> {
  context.log('event grid event recieved:', event)
  const deliveryStatus = event.data.status as EmailDeliveryStatus
  const ads = await getAppDataSource(context)
  if (deliveryStatus === EmailDeliveryStatus.Quarantined || deliveryStatus === EmailDeliveryStatus.FilteredSpam) {
    context.warn(`A notification email to ${event.data.recipient} has been flagged as ${deliveryStatus}!`)
    await newAlertItem({ context, ads, desc: 'A notification email has been quaruantined or flagged as spam!', level: AlertLevel.WARN })
  } else if ([EmailDeliveryStatus.Suppressed, EmailDeliveryStatus.Bounced, EmailDeliveryStatus.Failed].includes(deliveryStatus)) {
    context.log(
      `Delivery of an email notification to ${event.data.recipient} has failed with the following status: ${deliveryStatus}. Restricting the email address now.`
    )
    const emailRepo = ads.getRepository(EmailRecipient)
    const recipients = await emailRepo.find({ where: { email: event.data.recipient as string } })
    recipients.forEach((r) => {
      r.restricted = true
    })
    await emailRepo.save(recipients)
  }
}

app.eventGrid('emailDeliveryCallback', {
  handler: emailDeliveryCallback,
})
