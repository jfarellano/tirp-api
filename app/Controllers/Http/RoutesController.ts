import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Responses from "App/Helpers/Responses"
import Tour from 'App/Models/Tour'
import Route from 'App/Models/Route'



export default class RoutesController {

    async index({ auth, bouncer, response}: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)
        let Routes = (await Route.query()
            .preload('tour'))
            .map( Route => Route.serialize())
        return Responses.success(Routes)
    }

    async show({ params }) {
        let Routes = (await Route.query()
            .where('tour_id', params.id)
            .preload('tour'))
            .map( Route => Route.serialize())
        return Responses.success(Routes)
    }

    async store({ request, response, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        const user = auth.use('api').user!

        const attrs = request.only([
            'tour_id',
            'latitude',
            'longitude'
        ])
        
        const tour = await Tour.findOrFail(attrs.tour_id)

        if (user.id != tour.tirperId)
            return Responses.error(response)

        const route = new Route()

        route.latitude = attrs.latitude
        route.longitude = attrs.longitude
        route.related('tour').associate(tour)

        if (await route.save())
            return Responses.success(route.serialize())
        else
            return Responses.error(response)
    }
}
