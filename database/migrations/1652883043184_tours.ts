import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tours extends BaseSchema {
  protected tableName = 'tours'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('participants')
      table.integer('duration')
      table.datetime('datetime')
      table.enu('status', [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
      ]).defaultTo(0)
      table.integer('tirper_id')
        .unsigned()
        .references('users.id')
      table.integer('owner_id')
        .unsigned()
        .references('users.id')
      table.integer('language_id')
        .unsigned()
        .references('languages.id')
      table.integer('city_id')
        .unsigned()
        .references('cities.id')
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
