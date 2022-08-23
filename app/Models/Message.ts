import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Tour from './Tour'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column()
  public UserId: number

  @belongsTo(() => User, {
    foreignKey: 'UserId'
  })
  public sender: BelongsTo<typeof User>

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
