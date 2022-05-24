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

  public async index({ response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.$extras.type !== 'admin')
      throw new BadResquestException('You are not allowed to see all user', 401)
    const users = await Users.all()
    return response.status(200).json(users)
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const userId = request.param('id')
    const user = await Users.findBy('id', userId)
    if (!user) throw new BadResquestException('Invalid user', 400)
    const loggedUser = auth.user
    if (loggedUser?.$extras.type !== 'admin' && loggedUser?.$attributes.id !== userId)
      throw new BadResquestException('You are not allowed to update this user', 401)
    const infos = await request.validate(UpdateUserValidator)
    const filteredInfos = Object.entries(infos).reduce((acc, [key, value]) => {
      if (value) acc[key] = value
      return acc
    }, {})
    if (loggedUser?.$extras.type !== 'admin' && filteredInfos['type'])
      throw new BadResquestException('You are not allowed to update this property', 401)
    user.merge(filteredInfos)
    await user.save()
    user.refresh()
    return response.status(200).json(user)
  }
}
