/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export const IsBiggerThan = (property: string, validationOptions?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
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
        },
      },
    })
  }
}

export const IsLaterThan = (property: string, validationOptions?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
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
          return (
            typeof value === 'string' &&
            !isNaN(Date.parse(value)) &&
            typeof relatedValue === 'string' &&
            !isNaN(Date.parse(relatedValue)) &&
            Date.parse(value) > Date.parse(relatedValue)
          )
        },
      },
    })
  }
}
