import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Company from 'App/Models/Company'
import { DateTime } from 'luxon'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public street: string

  @column()
  public number: string

  @column()
  public complement: string

  @column()
  public neighborhood: string

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public zipCode: string

  @column()
  public country: string

  @column({ columnName: 'company_id' })
  public companyId: number

  @belongsTo(() => Company, {
    foreignKey: 'companyId',
  })
  public company: BelongsTo<typeof Company>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
