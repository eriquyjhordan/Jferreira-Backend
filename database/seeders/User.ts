import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Users from 'App/Models/Users'
import { v4 as uuid } from 'uuid'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await Users.createMany([
      {
        id: uuid(),
        email: 'eriquy@gmail.com',
        type: 'admin',
        password: '12345678',
        name: 'Eriquy Jhordan',
        phone: '+55 (11) 99999-9999',
        avatar: 'https://github.com/eriquyjhordan.png',
      },
      {
        id: uuid(),
        email: 'jhonatanfs10@hotmail.com',
        password: '12345678',
        name: 'Jhonatan Ferreira',
        phone: '+55 (11) 99999-9999',
        avatar: 'https://avatars0.githubusercontent.com/u/5695589?s=460&v=4',
      },
    ])
  }
}
