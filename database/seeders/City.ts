import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/City'

export default class CitySeeder extends BaseSeeder {
  public async run () {
    await City.createMany([
      {
        name: 'milano',
        picture: 'default.png',
        countryId: 1
      },
      {
        name: 'roma',
        picture: 'default.png',
        countryId: 1
      },
      {
        name: 'new york',
        picture: 'default.png',
        countryId: 2
      },
      {
        name: 'washington',
        picture: 'default.png',
        countryId: 2
      },
      {
        name: 'paris',
        picture: 'default.png',
        countryId: 3
      },
      {
        name: 'nantes',
        picture: 'default.png',
        countryId: 3
      },
      {
        name: 'bogota',
        picture: 'default.png',
        countryId: 4
      },
      {
        name: 'barranquilla',
        picture: 'default.png',
        countryId: 4
      },
    ])
  }
}
