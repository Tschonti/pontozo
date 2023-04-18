import { registerDecorator, validate, ValidationArguments, ValidationError, ValidationOptions } from 'class-validator'

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