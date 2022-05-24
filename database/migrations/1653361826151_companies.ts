import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('person_type')
      table.string('document').notNullable()
      table.string('name')
      table.string('ie')
      table.boolean('status').notNullable().defaultTo(true)
      table.string('type')
      table.dateTime('registration_date')
      table.dateTime('first_purchase')
      table.dateTime('last_purchase')
      table.uuid('user_id').references('id').inTable('users')
      table.dateTime('created_at', { useTz: true })
      table.dateTime('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
