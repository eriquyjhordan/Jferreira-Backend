import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadResquestException from 'App/Exceptions/BadResquestException'
import Company from 'App/Models/Company'
import { cnpj, cpf } from 'cpf-cnpj-validator'

export default class CompaniesController {
  private convertDate(date: string) {
    if (!date) return null
    const [day, month, year] = date.split('/')
    return new Date(`${year},${month},${day}`)
  }

  private validateDocument(document: string) {
    const documentWithoutDots = document.replace(/\./g, '').replace(/\s/g, '').replace(/\//g, '')
    if (documentWithoutDots.length === 11) {
      if (cpf.isValid(documentWithoutDots)) return documentWithoutDots
    } else if (documentWithoutDots.length === 14) {
      if (cnpj.isValid(documentWithoutDots)) return documentWithoutDots
    } else {
      throw new BadResquestException('Invalid document', 400)
    }
  }

  public async create({ request, response, auth }: HttpContextContract) {
    const user = await auth.user
    if (user.$attributes.type !== 'admin')
      throw new BadResquestException("You don't have permission to do this operation", 401)
    let data = request.only([
      'person_type',
      'document',
      'name',
      'ie',
      'type',
      'registration_date',
      'first_purchase',
      'last_purchase',
      'user_id',
      'address',
    ])
    data.document = this.validateDocument(data.document)
    const registrationDate = this.convertDate(data.registration_date)
    const firstPurchase = this.convertDate(data.first_purchase)
    const lastPurchase = this.convertDate(data.last_purchase)
    const address = data.address
    data = {
      ...data,
      registration_date: registrationDate,
      first_purchase: firstPurchase,
      last_purchase: lastPurchase,
    }
    delete data.address
    const companyAlreadyExists = await Company.findBy('document', data.document)
    if (companyAlreadyExists) throw new BadResquestException('Company already exists', 409)
    const company = await Company.create(data)
    if (address) {
      const addressData = {
        ...address,
        company_id: company.id,
      }
      await company.related('address').create(addressData)
    }
    return response.created({
      company,
    })
  }
}
