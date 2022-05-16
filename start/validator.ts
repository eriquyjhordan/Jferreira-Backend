import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('userType', (value) => {
  if (typeof value !== 'string') {
    return
  }
  const usersTypes = ['admin', 'user']

  if (!usersTypes.includes(value)) {
    return `${value} is not a valid user type`
  }
})
