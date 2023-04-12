import { HttpResponseInit } from '@azure/functions'
import { registerDecorator, validate, ValidationArguments, ValidationError, ValidationOptions } from 'class-validator'

export type ResponseParams = {
  body?: any
  status?: number
  headers?: object
}

export const JsonResWrapper = async (p: Promise<ResponseParams>): Promise<HttpResponseInit> => {
  return genJsonRes(await p)
}

export const genJsonRes = ({ body, status, headers }: ResponseParams): HttpResponseInit => ({
  body: JSON.stringify(body),
  status,
  headers: {
    'Content-Type': 'application/json',
    ...headers
  }
})

export const myvalidate = async (object: object): Promise<ValidationError[]> => validate(object, { whitelist: true })

export function IsBiggerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBiggerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]
          return typeof value === 'number' && typeof relatedValue === 'number' && value > relatedValue
        }
      }
    })
  }
}
