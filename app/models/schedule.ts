import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import Film from './film.js'
import Studio from './studio.js'
import Ticket from './ticket.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare filmId: number

  @column()
  declare studioId: number
  
  @column()
  declare date: Date

  @column()
  declare time: string

  @belongsTo(() => Film)
  declare film: BelongsTo<typeof Film>

  @belongsTo(() => Studio)
  declare studio: BelongsTo<typeof Studio>

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>

  @computed()
  get ticketAvailable() {
    if (!this.studio || !this.tickets) return 0
    return this.studio.capacity - this.tickets.length
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}