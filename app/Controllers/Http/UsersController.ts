import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid } from 'uuid'
import Users from 'App/Models/Users'
import CreteUserValidator from 'App/Validators/CreteUserValidator'
import BadResquestException from 'App/Exceptions/BadResquestException'

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const data = await request.validate(CreteUserValidator)
    const userAlreadyExists = await Users.findBy('email', data.email)
    if (userAlreadyExists) throw new BadResquestException('user already exists', 409)
    const userId = uuid()
    const user = await Users.create({
      id: userId,
      ...data,
    })
    return response.status(201).json(user)
  }
}
