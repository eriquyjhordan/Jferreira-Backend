import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid } from 'uuid'
import Product from 'App/Models/Product'

export default class ProductsController {
  public async create({ request, response }: HttpContextContract) {
    const productId = uuid()
    const data = request.only([
      'name',
      'code',
      'quantity',
      'unitPrice',
      'totalPrice',
      'boxes',
      'grossWeight',
      'liquidWeight',
      'ncm',
      'cest',
      'codigoBarras',
      'puMedEnt',
      'puMedSaida',
      'origem',
      'ipi',
      'providerId',
    ])
    const product = await Product.create({
      id: productId,
      ...data,
    })

    return response.json(product)
  }

  public async index({ response }: HttpContextContract) {
    const products = await Product.all()
    const productsWithProviders = await Promise.all(
      products.map(async (product) => {
        const provider = await product.related('company').query().first()
        delete product.$attributes.providerId
        return {
          ...product.$attributes,
          provider: provider ? provider.$attributes : null,
        }
      })
    )
    return response.json(productsWithProviders)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)
    const data = request.only([
      'name',
      'code',
      'quantity',
      'unitPrice',
      'totalPrice',
      'boxes',
      'grossWeight',
      'liquidWeight',
      'ncm',
      'cest',
      'codigoBarras',
      'puMedEnt',
      'puMedSaida',
      'origem',
      'ipi',
      'providerId',
    ])
    product.merge(data)
    await product.save()
    return response.json(product)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.json({ success: true })
  }
}
