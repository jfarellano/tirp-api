import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Invitation from "App/Models/Invitation"
import Responses from "App/Helpers/Responses"
import User from 'App/Models/User'
import Tour from 'App/Models/Tour'
import InvitationsHelper from 'App/Helpers/InvitationsHelper'



export default class InvitationsController {

    async index() {
        let invitations = (await Invitation.query()
            .preload('tour')
            .preload('tirper'))
            .map( invitation => invitation.serialize())
        return Responses.success(invitations)
    }

    async show({ params }) {
        let invitation = await Invitation.findOrFail(params.id)
        await invitation.preload('tirper')
        await invitation.preload('tour')
        return Responses.success(invitation.serialize())
    }

    async store({ request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)

        const attrs = request.only([
            'tour_id',
            'user_id'
        ])
        
        const user = await User.findOrFail(attrs.user_id)
        const tour = await Tour.findOrFail(attrs.tour_id)

        const invitation = await InvitationsHelper.create(user, tour)

        if (invitation)
            return Responses.success(invitation.serialize())
        else
            return Responses.error(response)
    }

    async update({ params, request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        let invitation = await Invitation.findOrFail(params.id)
        const user = auth.use('api').user!
        if ( !await bouncer.allows('isAdmin') && user.id != invitation.UserId)
            return Responses.error(response)

        const attrs = request.only([
            'why',
            'answer'
        ])

        invitation.why = attrs.why
        invitation.answer = attrs.answer
        
        if ( await invitation.save() ) 
            return Responses.success(invitation.serialize())
        else 
            return Responses.error('Failed updating Invitation')
    }

    async destroy({ params, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)
            
        let invitation = await Invitation.findOrFail(params.id)
        
        await invitation.delete()
        return Responses.success(true)
    }
}
