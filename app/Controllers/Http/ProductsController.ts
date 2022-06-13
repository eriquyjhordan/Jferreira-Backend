import BadResquestException from 'App/Exceptions/BadResquestException'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid } from 'uuid'
import excelToJson from 'convert-excel-to-json'
import Product from 'App/Models/Product'

export default class ProductsController {
  public async create({ request, response }: HttpContextContract) {
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
    const productAlreadyExists = await Product.findBy('code', data.code)
    if (productAlreadyExists) throw new BadResquestException('Product already exists', 409)
    const productId = uuid()
    const product = await Product.create({
      id: productId,
      ...data,
    })

    return response.json(product)
  }

  public async uploadFile({ request, response }: HttpContextContract) {
    const file = request.file('file')
    if (file) {
      const fileName = `${uuid()}.${file.extname}`
      await file.move(`${__dirname}/../../../tmp/files`, {
        name: fileName,
      })
      const result = excelToJson({
        sourceFile: `${__dirname}/../../../tmp/files/${fileName}`,
        sheets: ['Pre Pedido'],
      })
      const products = result['Pre Pedido'].map((product) => {
        if (
          product['D'] &&
          product['A'] &&
          typeof product['A'] === 'string' &&
          typeof product['G'] === 'number'
        ) {
          return {
            name: product['D'],
            code: product['A'],
            quantity: product['G'],
            unitPrice: product['I'],
            totalPrice: product['J'],
            boxes: product['K'],
            grossWeight: product['M'],
            liquidWeight: product['N'],
          }
        }
        return null
      })
      const productsWithoutNull = products.filter((product) => product)
      await Promise.all(
        productsWithoutNull.map(async (product) => {
          const productAlreadyExists = await Product.findBy('code', product['code'])
          if (productAlreadyExists) {
            productAlreadyExists.merge(product)
            return await productAlreadyExists.save()
          }
          const productId = uuid()
          const savedProduct = await Product.create({
            id: productId,
            ...product,
          })
          return savedProduct
        })
      )

      return response.json({
        success: true,
      })
    }
    return response.status(400).json({
      error: 'File not found',
    })
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
