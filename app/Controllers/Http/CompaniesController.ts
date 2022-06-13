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
    if (!document) return null
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
      'phone',
      'email',
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

  public async index({ response, auth }: HttpContextContract) {
    const user = await auth.user
    if (user.$attributes.type !== 'admin')
      throw new BadResquestException("You don't have permission to do this operation", 401)
    const companies = await Company.all()
    const companiesWithAddress = await Promise.all(
      companies.map(async (company) => {
        const address = await company.related('address').query().first()
        const associateUser = await company.related('user').query().first()
        delete company.$attributes.userId
        if (associateUser) {
          delete associateUser.$attributes.password
        }
        return {
          ...company.$attributes,
          address: address ? address.$attributes : null,
          user: associateUser ? associateUser.$attributes : null,
        }
      })
    )
    return response.json({
      companiesWithAddress,
    })
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    const user = await auth.user
    if (user.$attributes.type !== 'admin')
      throw new BadResquestException("You don't have permission to do this operation", 401)
    const company = await Company.findOrFail(params.id)
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
      'status',
      'phone',
      'email',
    ])
    if (data.document) data.document = this.validateDocument(data.document)
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
    await company.merge(data).save()

    if (address) {
      const addressData = {
        ...address,
        company_id: company.id,
      }
      await company.related('address').query().delete()
      await company.related('address').create(addressData)
    }
    await company.refresh()
    return response.json({
      company,
    })
  }
}
