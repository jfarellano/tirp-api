import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'

export default class CountrySeeder extends BaseSeeder {
  public async run () {
    await Country.createMany([
      {
        name: 'italy',
        picture: 'default.png',
        personValue: 20,
        timeValue: 10
      },
      {
        name: 'united states',
        picture: 'default.png',
        personValue: 15,
        timeValue: 7
      },
      {
        name: 'france',
        picture: 'default.png',
        personValue: 10,
        timeValue: 10
      },
      {
        name: 'colombia',
        picture: 'default.png',
        personValue: 15,
        timeValue: 5
      },
    ])
  }
}
