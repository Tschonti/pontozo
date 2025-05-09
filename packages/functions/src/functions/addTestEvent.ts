// import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
// import { RatingStatus } from '@pontozo/common'
// import { getUserFromHeaderAndAssertAdmin } from '../service/auth.service'
// import CriterionRating from '../typeorm/entities/CriterionRating'
// import EventRating, { RatingRole } from '../typeorm/entities/EventRating'
// import Stage from '../typeorm/entities/Stage'
// import { getAdminDataSource } from '../typeorm/getConfig'
// import { ENV } from '../util/env'
// import { handleException } from '../util/handleException'

// /**
//  *  The function creates a few mock criteria and three users rate these like so: (weights are not set by the function, edit them manually on the UI)
//  *
//  *  | criterion | categoryId  | stageSpecific | allowEmpty  | user1J rating | user2 rating  | user3 rating  | compWeight  | orgWeight |
//  *  -----------------------------------------------------------------------------------------------------------------------------------
//  *  | test 1    | 10001       | no            | no          | 2             | 3             | 0             | 2           | 3         |
//  *  -----------------------------------------------------------------------------------------------------------------------------------
//  *  | test 2    | 10001       | no            | yes         | 2             | 3             | -             | 1           | 1         |
//  *  -----------------------------------------------------------------------------------------------------------------------------------
//  *  | test 3    | 10002       | yes           | no          | 2, 2          | 3, 3          | 0, -          | 1           | 1         |
//  *  -----------------------------------------------------------------------------------------------------------------------------------
//  *  | test 4    | 10002       | yes           | yes         | 2, 2          | 3, 3          | -, -          | 0.5         | 0.7       |
//  *  -----------------------------------------------------------------------------------------------------------------------------------
//  *  | test 5    | 10002       | yes           | no          | 2, 2          | 3, 3          | 0, -          | 2           | 1         |
//  *  -----------------------------------------------------------------------------------------------------------------------------------
//  *  | test 6    | 10000       | yes           | yes         | -             | -             | -             | 2           | 1         |
//  *  -----------------------------------------------------------------------------------------------------------------------------------
//  *  | test 7    | 10000       | yes           | yes         | -             | 2             | 3             | 2           | 1         |
//  *  -----------------------------------------------------------------------------------------------------------------------------------
//  */

// const criterion = [
//   /*{
//     id: 10003,
//     name: 'teszt szempont 1',
//     description: 'teszt',
//     allowEmpty: false,
//     nationalOnly: false,
//     stageSpecific: false,
//     roles: '["COMPETITOR","COACH","ORGANISER","JURY"]',
//     text0: 'Rossz',
//     text1: 'Gyenge',
//     text2: 'Megfelelo',
//     text3: 'Kivalo',
//   },
//   {
//     id: 10004,
//     name: 'teszt szempont 2',
//     description: 'teszt',
//     allowEmpty: true,
//     nationalOnly: false,
//     stageSpecific: false,
//     roles: '["COMPETITOR","COACH","ORGANISER","JURY"]',
//     text0: 'Rossz',
//     text1: 'Gyenge',
//     text2: 'Megfelelo',
//     text3: 'Kivalo',
//   },
//   {
//     id: 10005,
//     name: 'teszt szempont 3',
//     description: 'teszt',
//     allowEmpty: false,
//     nationalOnly: false,
//     stageSpecific: true,
//     roles: '["COMPETITOR","COACH","ORGANISER","JURY"]',
//     text0: 'Rossz',
//     text1: 'Gyenge',
//     text2: 'Megfelelo',
//     text3: 'Kivalo',
//   },
//   {
//     id: 10006,
//     name: 'teszt szempont 4',
//     description: 'teszt',
//     allowEmpty: true,
//     nationalOnly: false,
//     stageSpecific: true,
//     roles: '["COMPETITOR","COACH","ORGANISER","JURY"]',
//     text0: 'Rossz',
//     text1: 'Gyenge',
//     text2: 'Megfelelo',
//     text3: 'Kivalo',
//   },
//   {
//     id: 10007,
//     name: 'teszt szempont 5',
//     description: 'teszt',
//     allowEmpty: false,
//     nationalOnly: false,
//     stageSpecific: true,
//     roles: '["COMPETITOR","COACH","ORGANISER","JURY"]',
//     text0: 'Rossz',
//     text1: 'Gyenge',
//     text2: 'Megfelelo',
//     text3: 'Kivalo',
//   },*/
//   {
//     id: 10008,
//     name: 'teszt szempont 6',
//     description: 'teszt',
//     allowEmpty: true,
//     nationalOnly: false,
//     stageSpecific: true,
//     roles: '["COMPETITOR","COACH","ORGANISER","JURY"]',
//     text0: 'Rossz',
//     text1: 'Gyenge',
//     text2: 'Megfelelo',
//     text3: 'Kivalo',
//   },
//   {
//     id: 10009,
//     name: 'teszt szempont 7',
//     description: 'teszt',
//     allowEmpty: true,
//     nationalOnly: false,
//     stageSpecific: true,
//     roles: '["COMPETITOR","COACH","ORGANISER","JURY"]',
//     text0: 'Rossz',
//     text1: 'Gyenge',
//     text2: 'Megfelelo',
//     text3: 'Kivalo',
//   },
// ]

// const eventId = 306
// const stage1Id = 980
// // const stage2Id = Math.floor(Math.random() * 1000)

// const crs = [
//   // { eventRatingId: 10008, criterionId: 10005, value: 2, stageId: stage2Id },
//   // { eventRatingId: 10008, criterionId: 10006, value: 2, stageId: stage2Id },
//   // { eventRatingId: 10008, criterionId: 10007, value: 2, stageId: stage2Id },
//   // { eventRatingId: 10009, criterionId: 10005, value: 3, stageId: stage2Id },
//   // { eventRatingId: 10009, criterionId: 10006, value: 3, stageId: stage2Id },
//   // { eventRatingId: 10009, criterionId: 10007, value: 3, stageId: stage2Id },
//   { eventRatingId: 10011, criterionId: 10003, value: 2 },
//   { eventRatingId: 10011, criterionId: 10004, value: 2 },
//   { eventRatingId: 10011, criterionId: 10005, value: 2, stageId: stage1Id },
//   { eventRatingId: 10011, criterionId: 10006, value: 2, stageId: stage1Id },
//   { eventRatingId: 10011, criterionId: 10007, value: 2, stageId: stage1Id },
//   { eventRatingId: 10011, criterionId: 10008, value: -1, stageId: stage1Id },
//   { eventRatingId: 10011, criterionId: 10009, value: -1, stageId: stage1Id },
//   { eventRatingId: 10012, criterionId: 10003, value: 3 },
//   { eventRatingId: 10012, criterionId: 10004, value: 3 },
//   { eventRatingId: 10012, criterionId: 10005, value: 3, stageId: stage1Id },
//   { eventRatingId: 10012, criterionId: 10006, value: 3, stageId: stage1Id },
//   { eventRatingId: 10012, criterionId: 10007, value: 3, stageId: stage1Id },
//   { eventRatingId: 10012, criterionId: 10008, value: -1, stageId: stage1Id },
//   { eventRatingId: 10012, criterionId: 10009, value: 2, stageId: stage1Id },
//   { eventRatingId: 10013, criterionId: 10003, value: 0 },
//   { eventRatingId: 10013, criterionId: 10005, value: 0, stageId: stage1Id },
//   { eventRatingId: 10013, criterionId: 10007, value: 0, stageId: stage1Id },
//   { eventRatingId: 10013, criterionId: 10008, value: -1, stageId: stage1Id },
//   { eventRatingId: 10013, criterionId: 10009, value: 3, stageId: stage1Id },
// ]

// /**
//  * Util function to create mock data that makes testing the rating accumulation easier. In production setting, it does nothing.
//  * In development, creates a mock season, two categories and five criteria. Then it creates a mock event with two stages.
//  * Finally, it creates ratings for these criteria by three different users accordint to the table above.
//  */
// export const addTestEvent = async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
//   try {
//     if (ENV === 'production') {
//       return {}
//     }
//     await getUserFromHeaderAndAssertAdmin(req, context)
//     const ads = await getAdminDataSource()
//     await ads.manager.transaction(async (transactionalEntityManager) => {
//       /*const criteria = criterion.map((c) => transactionalEntityManager.create(Criterion, c))
//       await transactionalEntityManager.save(criteria)

//       const cat1 = transactionalEntityManager.create(Category, {
//         id: 10001,
//         name: 'Teszt kategoria 1',
//         description: 'versenyre vonatkozo szempontok',
//         criteria: [
//           {
//             order: 1,
//             criterion: criteria[0],
//           },
//           {
//             order: 2,
//             criterion: criteria[1],
//           },
//         ],
//       })
//       const cat2 = transactionalEntityManager.create(Category, {
//         id: 10002,
//         name: 'Teszt kategoria 2',
//         description: 'futamra vonatkozo szempontok',
//         criteria: [
//           {
//             order: 1,
//             criterion: criteria[2],
//           },
//           {
//             order: 2,
//             criterion: criteria[3],
//           },
//           {
//             order: 3,
//             criterion: criteria[4],
//           },
//         ],
//       })
//       const cat1 = transactionalEntityManager.create(Category, {
//         id: 10000,
//         name: 'Teszt kategoria 3',
//         description: 'futamra vonatkozo szempontok',
//         criteria: [
//           {
//             order: 1,
//             criterion: criteria[0],
//           },
//           {
//             order: 2,
//             criterion: criteria[1],
//           },
//         ],
//       })
//       await transactionalEntityManager.save([cat1])*/
//       /*
//       const season = transactionalEntityManager.create(Season, {
//         name: 'Teszt szezon',
//         startDate: new Date('2012-09-01'),
//         endDate: new Date('2012-09-30'),
//         categories: [
//           {
//             order: 1,
//             category: cat1,
//           },
//           { order: 2, category: cat2 },
//         ],
//       })
//       await transactionalEntityManager.save(season)*/
//       /*
//       const event = transactionalEntityManager.create(Event, {
//         id: eventId,
//         name: `Teszt verseny #${eventId}`,
//         organisers: [],
//         startDate: '2012-09-03',
//         highestRank: Rank.REGIONAL,
//         state: EventState.INVALIDATED,
//         type: 'VERSENY',
//         seasonId: 2014,
//       })
//       await transactionalEntityManager.save(event)

//       const stage1 = transactionalEntityManager.create(Stage, {
//         id: stage1Id,
//         eventId: eventId,
//         disciplineId: 1,
//         name: 'Futam 1',
//         rank: Rank.REGIONAL,
//         startTime: `${Date.now() / 1000}`,
//       })
//       /*const stage2 = transactionalEntityManager.create(Stage, {
//         id: stage2Id,
//         eventId: eventId,
//         disciplineId: 2,
//         name: 'Futam 2',
//         rank: Rank.REGIONAL,
//         startTime: `${Date.now() / 1000}`,
//       })
//       await transactionalEntityManager.save([stage1 stage2])*/
//       const stage1 = await transactionalEntityManager.findOne(Stage, { where: { id: 980 } })

//       const er1 = transactionalEntityManager.create(EventRating, {
//         id: 10011,
//         eventId: eventId,
//         userId: 101442,
//         raterAge: 24,
//         role: RatingRole.JURY,
//         status: RatingStatus.SUBMITTED,
//         submittedAt: new Date(),
//         createdAt: new Date(),
//         stages: [stage1 /*stage2*/],
//       })

//       const er2 = transactionalEntityManager.create(EventRating, {
//         id: 10012,
//         eventId: eventId,
//         userId: 101404,
//         raterAge: 53,
//         role: RatingRole.COMPETITOR,
//         status: RatingStatus.SUBMITTED,
//         submittedAt: new Date(),
//         createdAt: new Date(),
//         stages: [stage1 /*stage2*/],
//       })

//       const er3 = transactionalEntityManager.create(EventRating, {
//         id: 10013,
//         eventId: eventId,
//         userId: 106916,
//         raterAge: 13,
//         role: RatingRole.COMPETITOR,
//         status: RatingStatus.SUBMITTED,
//         submittedAt: new Date(),
//         createdAt: new Date(),
//         stages: [stage1],
//       })
//       await transactionalEntityManager.save([er1, er2, er3])

//       const crEntities = crs.map((cr) => transactionalEntityManager.create(CriterionRating, cr))
//       await transactionalEntityManager.save(crEntities)
//     })
//     context.log('Siker!!!')
//   } catch (error) {
//     return handleException(req, context, error)
//   }
// }

// app.http('addTestEvent', {
//   methods: ['POST'],
//   route: 'addTestEvent',
//   handler: addTestEvent,
// })
