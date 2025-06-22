import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Schedules from './schedule.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Studio extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare capacity: number

  // Sebuah studio bisa memiliki banyak jadwal tayang
  @hasMany(() => Schedules)
  declare schedules: HasMany<typeof Schedules>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
