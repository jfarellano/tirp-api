import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        email: 'juan@mail.com',
        password: 'pass123',
        picture: 'default.png',
        name: 'juan',
        lastname: 'arellano',
        roles: 'tirper admin'
      },
      {
        email: 'andres@mail.com',
        password: 'pass123',
        picture: 'default.png',
        name: 'andres',
        lastname: 'diaz',
        roles: 'tirper'
      },
      {
        email: 'mario@mail.com',
        password: 'pass123',
        picture: 'default.png',
        name: 'mario',
        lastname: 'rodriguez',
        roles: ''
      }
    ])
  }
}
