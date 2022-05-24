import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Company from 'App/Models/Company'
import { DateTime } from 'luxon'

export default class Users extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public avatar: string

  @column()
  public isActive: boolean

  @hasOne(() => Company, {
    foreignKey: 'userId',
  })
  public company: HasOne<typeof Company>

  @beforeSave()
  public static async hashPassword(user: Users) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
