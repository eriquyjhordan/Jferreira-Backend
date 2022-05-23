import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadResquestException from 'App/Exceptions/BadResquestException'

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '5d',
      })
      return response.created({ user: auth.user, token })
    } catch (error) {
      throw new BadResquestException('Invalid credentials', 400)
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.noContent()
  }
}
