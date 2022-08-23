import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Routes extends BaseSchema {
  protected tableName = 'routes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tour_id').unsigned().references('tours.id')
      table.string('longitude')
      table.string('latitude')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
