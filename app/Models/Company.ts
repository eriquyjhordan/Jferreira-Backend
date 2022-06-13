import Product from 'App/Models/Product'
import { BaseModel, belongsTo, BelongsTo, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Address from 'App/Models/Address'
import Users from 'App/Models/Users'
import { DateTime } from 'luxon'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'person_type' })
  public personType: string

  @column()
  public document: string

  @column()
  public name: string

  @column()
  public ie: string

  @column()
  public status: boolean

  @column()
  public type: string

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public registrationDate: DateTime

  @column({ columnName: 'first_purchase' })
  public firstPurchase: DateTime

  @column({ columnName: 'last_purchase' })
  public lastPurchase: DateTime

  @column({ columnName: 'user_id' })
  public userId: string

  @belongsTo(() => Users, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof Users>

  @hasOne(() => Address, {
    foreignKey: 'companyId',
  })
  public address: HasOne<typeof Address>

  @hasOne(() => Product, {
    foreignKey: 'providerId',
  })
  public product: HasOne<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
