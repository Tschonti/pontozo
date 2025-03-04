import { InvocationContext } from '@azure/functions'
import { RatingStatus, ResultNotificationOptions } from '@pontozo/common'
import * as df from 'durable-functions'
import { ActivityHandler } from 'durable-functions'
import { In } from 'typeorm'
import { sendResultsReadyEmail } from '../../../service/email.service'
import { EmailRecipient } from '../../../typeorm/entities/EmailRecipient'
import Event from '../../../typeorm/entities/Event'
import EventRating from '../../../typeorm/entities/EventRating'
import { getAppDataSource } from '../../../typeorm/getConfig'

export const sendNotificationsActivityName = 'sendNotificationsActivity'

/**
 * Durable Functions activity that sends email notifications about the newly publish rating results to subscribed users
 * @param eventIds IDs of the events whose meaningful (= at least one user rated it) rating result were published
 * @returns whether the operation succeeded
 */
const calculateAvgRating: ActivityHandler = async (eventIds: number[], context: InvocationContext): Promise<boolean> => {
  try {
    const ads = await getAppDataSource(context)
    const emailRepo = ads.getRepository(EmailRecipient)
    const eventRatingRepo = ads.getRepository(EventRating)
    const [events, recipientsOfAll, recipientsOfRated] = await Promise.all([
      ads.getRepository(Event).find({ where: { id: In(eventIds) } }),
      emailRepo.find({ where: { resultNotifications: ResultNotificationOptions.ALL } }),
      emailRepo.find({ where: { resultNotifications: ResultNotificationOptions.ONLY_RATED } }),
    ])
    await Promise.all([
      ...recipientsOfAll.map((r) => sendResultsReadyEmail(r, events, context)),
      ...recipientsOfRated.map(async (r) => {
        const eventsRated = await eventRatingRepo.find({
          where: { userId: r.userId, eventId: In(eventIds), status: RatingStatus.SUBMITTED },
        })
        return sendResultsReadyEmail(
          r,
          eventsRated.map((er) => events.find((e) => e.id === er.eventId)),
          context
        )
      }),
    ])
    context.log(`Email notifications sent to ${recipientsOfAll.length + recipientsOfRated.length} user(s)`)
    return true
  } catch (e) {
    context.error('error in send notification activity: ', e)
    return false
  }
}

df.app.activity(sendNotificationsActivityName, { handler: calculateAvgRating })
