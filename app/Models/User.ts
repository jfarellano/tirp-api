import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  computed
} from '@ioc:Adonis/Lucid/Orm'
import Tour from './Tour'
import Language from './Language'
import Invitation from './Invitation'
import Message from './Message'
import Review from './Review'

export default class User extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public picture: string

  @column()
  public name: string

  @column()
  public lastname: string

  @column()
  public roles: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Tour, {
    localKey: 'tirperId',
  })
  public tirper_tours: HasMany<typeof Tour>

  @hasMany(() => Tour, {
    localKey: 'ownerId',
  })
  public tours: HasMany<typeof Tour>

  @hasMany(() => Invitation, {
    localKey: 'UserId',
  })
  public invitations: HasMany<typeof Invitation>

  @hasMany(() => Message, {
    localKey: 'UserId',
  })
  public messages: HasMany<typeof Message>

  @hasMany(() => Review, {
    localKey: 'UserId',
  })
  public reviews: HasMany<typeof Review>

  @manyToMany(() => Language, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'language_id',
  })
  public languages: ManyToMany<typeof Language>

  @computed()
  public get isTirper() {
    return this.roles.includes('tirper')
  }

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
