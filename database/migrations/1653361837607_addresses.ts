import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('street')
      table.string('number')
      table.string('complement')
      table.string('neighborhood')
      table.string('city')
      table.string('state')
      table.string('zip_code')
      table.string('country')
      table.integer('company_id').unsigned().references('id').inTable('companies')
      table.dateTime('created_at', { useTz: true })
      table.dateTime('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
