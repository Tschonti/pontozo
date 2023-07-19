import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { plainToClass } from 'class-transformer'
import { In } from 'typeorm'
import { getUserFromHeaderAndAssertAdmin } from '../../service/auth.service'
import Category from '../../typeorm/entities/Category'
import { CategoryToCriterion } from '../../typeorm/entities/CategoryToCriterion'
import Criterion from '../../typeorm/entities/Criterion'
import { getAppDataSource } from '../../typeorm/getConfig'
import { httpResFromServiceRes } from '../../util/httpRes'
import { myvalidate } from '../../util/validation'
import { CreateCategoryDTO } from './types/CreateCategory.dto'

export const updateCategory = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  const adminCheck = await getUserFromHeaderAndAssertAdmin(req)
  if (adminCheck.isError) {
    return httpResFromServiceRes(adminCheck)
  }

  if (!req.body) {
    return {
      status: 400,
      body: 'No body attached to POST query.'
    }
  }
  const id = parseInt(req.params.id)
  if (isNaN(id)) {
    return {
      status: 400,
      body: 'Invalid id!'
    }
  }
  try {
    const dto = plainToClass(CreateCategoryDTO, await req.json())
    const errors = await myvalidate(dto)
    if (errors.length > 0) {
      return {
        status: 400,
        jsonBody: errors
      }
    }
    const ads = await getAppDataSource()
    const criteria = await ads.getRepository(Criterion).find({ where: { id: In(dto.criterionIds) } })
    let category = await ads.manager.findOne(Category, {
      where: { id },
      relations: { criteria: { criterion: true }, seasons: { season: true } }
    })
    if (category === null) {
      return {
        status: 404,
        body: 'Category not found!'
      }
    }
    if (category.seasons.some(({ season }) => season.startDate < new Date())) {
      return {
        status: 400,
        body: "This category can no longer be edited, because it's part of a season that has already started!"
      }
    }
    category.name = dto.name
    category.description = dto.description
    const newCtcs = []
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
        newCtc.criterion = criteria.find((c) => c.id === cId)
        newCtc.order = idx
        newCtcs.push(newCtc)
      }
    })
    category.criteria = newCtcs
    category = await ads.manager.save(category)

    return {
      jsonBody: category
    }
  } catch (e) {
    context.log(e)
    return {
      status: 400,
      body: e
    }
  }
}

app.http('categories-update', {
  methods: ['PUT'],
  route: 'categories/{id}',
  handler: updateCategory
})
