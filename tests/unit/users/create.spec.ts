import { test } from '@japa/runner'
import supertest from 'supertest'

test.group('create Users', () => {
  test('it shoul create an user', async ({ assert }) => {
    await supertest('http://localhost:3333')
      .post('/users')
      .send({
        name: 'John Doe',
        email: '',
        password: '123456',
      })
      .expect(201)
  })
})
