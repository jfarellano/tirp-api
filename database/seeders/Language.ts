import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Language from 'App/Models/Language'

export default class LanguageSeeder extends BaseSeeder {
  public async run () {
    await Language.createMany([
      {
        name: 'spanish'
      },
      {
        name: 'english'
      },
      {
        name: 'italian'
      },
      {
        name: 'french'
      },
    ])
  }
}
