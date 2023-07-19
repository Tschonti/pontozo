import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { EntityWithEditableIndicator } from '../../util/EntityWithEditableIndicator.dto'
import { httpResFromServiceRes } from '../../util/httpRes'

export const getCriterion = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = await getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  const criterionRepo = (await getAppDataSource()).getRepository(Criterion)
  try {
    const criterion = await criterionRepo.findOne({ where: { id }, relations: { categories: { category: { seasons: { season: true } } } } })
    if (!criterion) {
      return {
        status: 404,
        body: 'Criterion not found!'
      }
    }
    const { categories, ...plainCriterion } = criterion
    return {
      jsonBody: {
        ...plainCriterion,
        roles: JSON.parse(criterion.roles),
        editable: !categories.some(({ category }) => category.seasons.some(({ season }) => season.startDate < new Date()))
      } as EntityWithEditableIndicator<Criterion>
    }
  } catch (error) {
    context.error(error)
    return {
      status: 500,
      body: error
    }
  }
}

app.http('criteria-getOne', {
  methods: ['GET'],
  route: 'criteria/{id}',
  handler: getCriterion
})
