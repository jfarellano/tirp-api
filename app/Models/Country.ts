import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import City from "App/Models/City"

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column({})
  public picture: string

  @column({})
  public personValue: number

  @column({})
  public timeValue: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => City, {
    localKey: 'countryId'
  })
  public cities: HasMany<typeof City>
}
