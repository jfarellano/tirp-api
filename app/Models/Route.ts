import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Tour from './Tour'

export default class Route extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public longitude: string

  @column()
  public latitude: string

  @column({})
  public TourId: number

  @belongsTo(() => Tour, {
    foreignKey: 'TourId'
  })
  public tour: BelongsTo<typeof Tour>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
