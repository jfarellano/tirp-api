import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Answers from 'Contracts/enums/Answers'
import User from './User'
import Tour from './Tour'

export default class Invitation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public why: string

  @column()
  public answer: Answers

  @column()
  public UserId: number

  @belongsTo(() => User, {
    foreignKey: 'UserId'
  })
  public tirper: BelongsTo<typeof User>

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