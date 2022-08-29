import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Responses from "App/Helpers/Responses"
import Tour from 'App/Models/Tour'
import Message from 'App/Models/Message'



export default class MessagesController {

    async index({ auth, bouncer, response}: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)
        let messages = (await Message.query()
            .preload('tour')
            .preload('sender'))
            .map( message => message.serialize())
        return Responses.success(messages)
    }

    async show({ params }) {
        let messages = (await Message.query()
            .where('tour_id', params.id)
            .preload('tour')
            .preload('sender'))
            .map( message => message.serialize())
        return Responses.success(messages)
    }

    async store({ request, response, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        const user = auth.use('api').user!

        const attrs = request.only([
            'tour_id',
            'message'
        ])
        
        const tour = await Tour.findOrFail(attrs.tour_id)

        const message = new Message()

        message.message = attrs.message
        message.related('tour').associate(tour)
        message.related('sender').associate(user)

        if (await message.save())
            return Responses.success(message.serialize())
        else
            return Responses.error(response)
    }
}
