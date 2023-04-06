import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import CriterionRating from '../lib/typeorm/entities/CriterionRating'
import { getAppDataSource } from '../lib/typeorm/getConfig'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const id = context.bindingData.id as number
  if (isNaN(id)) {
    context.res = {
      status: 400,
      body: 'Invalid eventRating id!'
    }
    return
  }
  if (!req.body) {
    context.res = {
      status: 400,
      body: { message: `No body attached to POST query.` }
    }
    return
  }
  const ratingRepo = (await getAppDataSource()).getRepository(CriterionRating)

  try {
    const rating = await ratingRepo.findOneBy({ criterion: { id: req.body.criterionId }, eventRating: { id } })
    if (rating === null) {
      await ratingRepo.insert({ criterion: { id: req.body.criterionId }, value: req.body.value, eventRating: { id } })
    } else {
      rating.value = req.body.value
      await ratingRepo.save(rating)
    }
    context.res = {
      status: 204
    }
  } catch (e) {
    context.log(e)
    context.res = {
      status: 400,
      body: e
    }
  }
}

export default httpTrigger
