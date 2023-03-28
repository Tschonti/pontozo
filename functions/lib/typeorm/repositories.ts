import { AppDataSource } from './config'
import Criterion from './entities/Criterion'
import Rating from './entities/Rating'

export const criterionRepo = AppDataSource.getRepository(Criterion)
export const ratingRepo = AppDataSource.getRepository(Rating)
