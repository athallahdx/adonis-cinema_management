import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('film_id').unsigned().references('id').inTable('films').onDelete('CASCADE')
      table.integer('studio_id').unsigned().references('id').inTable('studios').onDelete('CASCADE')
      table.date('date').notNullable()
      table.time('time').notNullable()
      table.timestamps(true, true)
   })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}