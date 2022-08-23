import { DateTime } from 'luxon'
import { 
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  hasOne,
  HasOne
} from '@ioc:Adonis/Lucid/Orm'
import Status from '../../contracts/enums/Status'
import User from './User'
import Language from './Language'
import City from './City'
import Invitation from './Invitation'
import Message from './Message'
import Review from './Review'
import Route from './Route'

export default class Tour extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public participants: number

  @column({})
  public duration: number

  @column.dateTime({})
  public datetime: DateTime

  @column({})
  public status: Status

  @column()
  public cityId: number

  @belongsTo(() => City, {
    foreignKey: 'cityId'
  })
  public city: BelongsTo<typeof City>

  @column()
  public tirperId: number

  @belongsTo(() => User, {
    foreignKey: 'tirperId'
  })
  public tirper: BelongsTo<typeof User>

  @column()
  public ownerId: number
  
  @belongsTo(() => User, {
    foreignKey: 'ownerId'
  })
  public owner: BelongsTo<typeof User>

  @column()
  public languageId: number
  
  @belongsTo(() => Language, {
    foreignKey: 'languageId'
  })
  public language: BelongsTo<typeof Language>

  @hasMany(() => Invitation, {
    localKey: 'TourId',
  })
  public invitations: HasMany<typeof Invitation>

  @hasMany(() => Message, {
    localKey: 'TourId',
  })
  public messages: HasMany<typeof Message>

  @hasOne(() => Review, {
    localKey: 'TourId',
  })
  public review: HasOne<typeof Review>

  @hasMany(() => Route, {
    localKey: 'TourId',
  })
  public route: HasMany<typeof Route>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
