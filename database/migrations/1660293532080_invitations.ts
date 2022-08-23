import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Invitations extends BaseSchema {
  protected tableName = 'invitations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id')
      table.integer('tour_id').unsigned().references('tours.id')
      table.enu('answer', [
        '0',
        '1',
        '2'
      ]).defaultTo(0)
      table.string('why')

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
