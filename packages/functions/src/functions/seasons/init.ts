import { app, InvocationContext, Timer } from '@azure/functions'
import { AlertLevel, ratingRoleArray } from '@pontozo/common'
import { newAlertItem } from '../../service/alert.service'
import Season from '../../typeorm/entities/Season'
import SeasonCriterionCount from '../../typeorm/entities/SeasonCriterionCount'
import { getAppDataSource } from '../../typeorm/getConfig'
import { currentSeasonFilter } from '../../util/currentSeasonFilter'
import { ENV } from '../../util/env'

/**
 * Called every night automatically. Checks if the criteria have been counted for the current season.
 * If not, it counts them and saves the results to the DB.
 */
export const initSeason = async (myTimer: Timer, context: InvocationContext): Promise<void> => {
  try {
    const ads = await getAppDataSource(context)
    const season = await ads.getRepository(Season).findOne({
      where: currentSeasonFilter,
      relations: { categories: { category: { criteria: { criterion: true } } }, criterionCount: true },
    })
    if (season && season.criterionCount.length === 0) {
      await ads.getRepository(SeasonCriterionCount).save(
        ratingRoleArray.map((role) => {
          const scc = new SeasonCriterionCount()
          scc.seasonId = season.id
          scc.role = role
          scc.eventSpecificAnyRank = 0
          scc.eventSpecificHigherRank = 0
          scc.stageSpecificAnyRank = 0
          scc.stageSpecificHigherRank = 0

          season.categories.forEach((stc) => {
            stc.category.criteria
              .filter((ctc) => ctc.criterion.roles.includes(role))
              .forEach(({ criterion: c }) => {
                if (c.nationalOnly && c.stageSpecific) {
                  scc.stageSpecificHigherRank++
                } else if (!c.nationalOnly && c.stageSpecific) {
                  scc.stageSpecificAnyRank++
                } else if (c.nationalOnly && !c.stageSpecific) {
                  scc.eventSpecificHigherRank++
                } else {
                  scc.eventSpecificAnyRank++
                }
              })
          })
          return scc
        })
      )
      await newAlertItem({ ads, context, desc: `Criterion count refreshed for Season #${season.id}` })
    }
  } catch (error) {
    await newAlertItem({ context, desc: `Error during season init: ${error}`, level: AlertLevel.ERROR })
  }
}

app.timer('seasons-init', {
  schedule: '0 1 0 * * *', // 0:01 AM every day
  handler: initSeason,
  runOnStartup: !(ENV === 'production'),
})
