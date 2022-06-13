import Company from 'App/Models/Company'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public quantity: number

  @column({ columnName: 'unit_price' })
  public unitPrice: number

  @column({ columnName: 'total_price' })
  public totalPrice: number

  @column()
  public boxes: number

  @column({ columnName: 'gross_weight' })
  public grossWeight: number

  @column({ columnName: 'liquid_weight' })
  public liquidWeight: number

  @column()
  public ncm: string

  @column()
  public cest: string

  @column({ columnName: 'codigo_barra' })
  public codigoBarras: string

  @column({ columnName: 'pu_med_ent' })
  public puMedEnt: number

  @column({ columnName: 'pu_med_saida' })
  public puMedSaida: number

  @column()
  public origem: string

  @column()
  public ipi: number

  @column({ columnName: 'provider_id' })
  public providerId: number

  @belongsTo(() => Company, {
    foreignKey: 'providerId',
  })
  public company: BelongsTo<typeof Company>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
