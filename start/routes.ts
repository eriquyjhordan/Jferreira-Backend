/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/users', 'UsersController.create')
Route.get('/users', 'UsersController.index').middleware('auth')
Route.put('/users/:id', 'UsersController.update').middleware('auth')
Route.post('/sessions', 'SessionsController.store')
Route.delete('/sessions', 'SessionsController.destroy')
Route.post('/companies', 'CompaniesController.create').middleware('auth')
Route.get('/companies', 'CompaniesController.index').middleware('auth')
Route.put('/companies/:id', 'CompaniesController.update').middleware('auth')
Route.post('/products', 'ProductsController.create').middleware('auth')
Route.get('/products', 'ProductsController.index').middleware('auth')
Route.put('/products/:id', 'ProductsController.update').middleware('auth')
Route.delete('/products/:id', 'ProductsController.destroy').middleware('auth')
Route.post('/products/file', 'ProductsController.uploadFile').middleware('auth')
