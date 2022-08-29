import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Application from '@ioc:Adonis/Core/Application'
import Tour from "App/Models/Tour"
import Responses from "App/Helpers/Responses"
import City from 'App/Models/City'
import Language from 'App/Models/Language'
import Status from 'Contracts/enums/Status'
import InvitationsHelper from 'App/Helpers/InvitationsHelper'
import User from 'App/Models/User'
import Invitation from 'App/Models/Invitation'


export default class ToursController {
    async index({ auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        const user = auth.use('api').user!

        const tours = await Tour.query().where(
            'owner_id',
            '=',
            user.id
        ).preload('owner')
        .preload('city')

        for (const tour of tours) {
            if (tour.tirper) {
                tour.load('tirper')
            }
            if (tour.review) {
                tour.load('review')
            }
        }
        return Responses.success(tours)
    }

    async show({ params, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        const user = auth.use('api').user!

        const tour = await Tour.query()
            .where(
                'id',
                '=',
                params.id
            )
            .where(
                'owner_id',
                '=',
                user.id
            ).preload('owner')
            .preload('city')

        if (tour[0]) {
            if (tour[0].tirper) {
                tour[0].load('tirper')
            }
            return Responses.success(tour)
        }
        return Responses.success('not found')
    }

    async store({ request, response, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        const user = auth.use('api').user!

        const attrs = request.only([
            'participants',
            'duration',
            'datetime',
            'language_id',
            'city_id'
        ])
        const tour = new Tour()
        tour.participants = attrs.participants
        tour.duration = attrs.duration
        tour.datetime = attrs.datetime
        tour.status = Status.CREATED

        // Associate City
        const city = await City.findOrFail(attrs.city_id)
        await tour.related('city').associate(city)

        // Associate Language
        const language = await Language.findOrFail(attrs.language_id)
        await tour.related('language').associate(language)

        // Associate Owner
        await tour.related('owner').associate(user)


        if (await tour.save()) {
            InvitationsHelper.inviteTirpers(tour)
            return Responses.success(tour)
        } else
            return Responses.error(response)
    }

    async update({ }: HttpContextContract) {
        // Unused
    }

    async destroy({ params, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        const user = auth.use('api').user!
        const tour = await Tour.findOrFail(params.id)

        if (!await bouncer.allows('isAdmin') && tour.ownerId != user.id)
            return Responses.error(response)

        await tour.delete()

        return Responses.success(true)
    }

    async assign({ params, request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if (!await bouncer.allows('isAdmin'))
            return Responses.error(response)
        
        const tour = await Tour.findOrFail(params.id)

        const attrs = request.only(['tirper_id'])
        const tirper = await User.findOrFail(attrs.tirper_id)
        const invitation = await Invitation
        .query()
        .where('user_id', '=', tirper.id)
        .where('tour_id', '=', tour.id)

        if( tirper.isTirper && invitation[0]) {
            await tour.related('tirper').associate(tirper)
            return Responses.success(true)
        } else
            return Responses.error(response)
    }
}
