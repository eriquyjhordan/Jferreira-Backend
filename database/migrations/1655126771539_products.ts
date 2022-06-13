import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.text('name').notNullable()
      table.string('code').notNullable().unique()
      table.integer('quantity').notNullable()
      table.double('unit_price').notNullable()
      table.double('total_price').notNullable()
      table.integer('boxes').notNullable()
      table.double('gross_weight').notNullable()
      table.double('liquid_weight').notNullable()
      table.string('ncm')
      table.string('cest')
      table.string('codigo_barra')
      table.double('pu_med_ent')
      table.double('pu_med_saida')
      table.string('origem')
      table.double('ipi')
      table.integer('provider_id').unsigned().references('id').inTable('companies')
      table.dateTime('created_at', { useTz: true })
      table.dateTime('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
