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

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.get('/', 'UsersController.indexLanguage')
  Route.post('/:id', 'UsersController.addLanguage')
  Route.delete('/:id', 'UsersController.removeLanguage')
}).prefix('/users/languages')

Route.group(() => {
  Route.post('/assign/:id', 'ToursController.assign')
}).prefix('/tours')

Route.resource('/countries', 'CountriesController').apiOnly()
Route.resource('/cities', 'CitiesController').apiOnly()
Route.resource('/languages', 'LanguagesController').apiOnly()
Route.resource('/users', 'UsersController').apiOnly()
Route.resource('/tours', 'ToursController').apiOnly()
Route.resource('/invitations', 'InvitationsController').apiOnly()
Route.resource('/messages', 'MessagesController').apiOnly()
Route.resource('/reviews', 'ReviewsController').apiOnly()
Route.resource('/routes', 'RoutesController').apiOnly()
Route.post('/login', 'AuthenticationController.login')

