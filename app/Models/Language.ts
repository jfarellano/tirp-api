import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Tour from './Tour'
import User from './User'

export default class Language extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'language_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => Tour, {
    localKey: 'languageId'
  })
  public tours: HasMany<typeof Tour>
}
