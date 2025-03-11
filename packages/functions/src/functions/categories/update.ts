import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { CreateCategory, PontozoException } from '@pontozo/common'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { CategoryToCriterion } from '../../typeorm/entities/CategoryToCriterion'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { handleException } from '../../util/handleException'
import { validateBody, validateId, validateWithWhitelist } from '../../util/validation'

export const updateCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    const user = await getUserFromHeaderAndAssertAdmin(req, context)
    validateBody(req)
    const id = validateId(req)
    const dto = plainToClass(CreateCategory, await req.json())
    await validateWithWhitelist(dto)

    const ads = await getAppDataSource(context)
    const criteria = await ads.getRepository(Criterion).find({ where: { id: In(dto.criterionIds) } })
    let category = await ads.manager.findOne(Category, {
      where: { id },
      relations: { criteria: { criterion: true }, seasons: { season: true } },
    })
    if (category === null) {
      throw new PontozoException('A kategória nem található!', 404)
    }
    if (category.seasons.some(({ season }) => season.startDate < new Date())) {
      throw new PontozoException('Ez a kategória már nem szerkeszthető, mert egy olyan szezon része, ami már elkezdődött!', 400)
    }
    category.name = dto.name
    category.description = dto.description
    const newCtcs: CategoryToCriterion[] = []
    category.criteria.forEach(async (ctc) => {
      if (dto.criterionIds.includes(ctc.criterion.id)) {
        newCtcs.push(ctc)
      } else {
        await ads.manager.delete(CategoryToCriterion, ctc)
      }
    })
    newCtcs.forEach((ctc) => {
      if (ctc.order !== dto.criterionIds.indexOf(ctc.criterion.id)) {
        ctc.order = dto.criterionIds.indexOf(ctc.criterion.id)
      }
    })
    dto.criterionIds.forEach((cId, idx) => {
      if (!newCtcs.map((ctc) => ctc.criterion.id).includes(cId)) {
        const newCtc = new CategoryToCriterion()
        const criterion = criteria.find((c) => c.id === cId)
        if (criterion) {
          newCtc.criterion = criterion
          newCtc.order = idx
          newCtcs.push(newCtc)
        }
      }
    })
    category.criteria = newCtcs
    category = await ads.manager.save(category)

    context.log(`User #${user.szemely_id} updated category #${category.id}`)
    return {
      jsonBody: category,
    }
  } catch (error) {
    return handleException(req, context, error)
  }
}

app.http('categories-update', {
  methods: ['PUT'],
  route: 'categories/{id}',
  handler: updateCategory,
})
