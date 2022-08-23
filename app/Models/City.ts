import { DateTime } from 'luxon'
import { 
  BaseModel, 
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'

import Country from 'App/Models/Country'
import Tour from './Tour'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column({})
  public picture: string

  @column({})
  public countryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Country, {
    foreignKey: 'countryId'
  })
  public country: BelongsTo<typeof Country>

  @hasMany(() => Tour, {
    localKey: 'cityId'
  })
  public tours: HasMany<typeof Tour>
}
