import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid } from 'uuid'
import Users from 'App/Models/Users'
import CreteUserValidator from 'App/Validators/CreteUserValidator'
import BadResquestException from 'App/Exceptions/BadResquestException'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

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
  public async index({ response }: HttpContextContract) {
    const users = await Users.all()
    return response.status(200).json(users)
  }
  public async update({ request, response }: HttpContextContract) {
    const userId = request.param('id')
    const user = await Users.findBy('id', userId)
    if (!user) throw new BadResquestException('Invalid user', 400)
    const infos = await request.validate(UpdateUserValidator)
    const filteredInfos = Object.entries(infos).reduce((acc, [key, value]) => {
      if (value) acc[key] = value
      return acc
    }, {})
    user.merge(filteredInfos)
    await user.save()
    user.refresh()
    return response.status(200).json(user)
  }
}
