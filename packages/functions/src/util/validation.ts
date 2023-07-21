import {  validate,  ValidationError } from 'class-validator'

export const validateWithWhitelist = async (object: object): Promise<ValidationError[]> => validate(object, { whitelist: true })
