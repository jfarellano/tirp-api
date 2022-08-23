import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tour from 'App/Models/Tour'
import { DateTime } from 'luxon'

const getRand = (max: number) => {
  return Math.floor(Math.random() * (max - 1) + 1)
}
const getStatus = () => {
  return Math.floor(Math.random() * 5)
}
const getDouble = (max: number) => {
  let value = getRand(max) + ''
  return value.length == 1 ? '0' + value : value
}

export default class TourSeeder extends BaseSeeder {
  public async run () {
    const tours: Object[] = []
    for( let i = 0; i < 30; i++) {
      const status = getStatus()
      tours.push({
        participants: getRand(5),
        duration: getRand(4),
        datetime: DateTime.fromISO(`2022-${getDouble(12)}-${getDouble(30)}T${getDouble(24)}:${getDouble(60)}:09.644Z`),
        languageId: getRand(4),
        cityId: getRand(8),
        status: status,
        ownerId: getRand(3),
        tirperId: status > 2 ? 2 : undefined,
      })
    }

    await Tour.createMany(tours)
  }
}
