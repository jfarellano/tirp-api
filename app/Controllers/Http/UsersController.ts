import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import User from "App/Models/User"
import Responses from "App/Helpers/Responses"
import Language from 'App/Models/Language'
const fs = require('fs')


export default class UsersController {
    async index({response, auth, bouncer}: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') ) 
            return Responses.error(response)
        const users = (await User.all()).map((user) => user.serialize())

        return Responses.success(users)
    }

    async show({ params, response, auth, bouncer}) {
        await auth.use('api').authenticate()
        let user
        let session = auth.use('api').user!
        if( await bouncer.allows('isSelf', session) )
            user = session
        if ( await bouncer.allows('isAdmin') && params.id)
            user = await User.find(params.id)
        if (user)
            return Responses.success({
                ...user.serialize(),
            })
        else
            return Responses.error(response);
    }

    async store({ request, response, bouncer }: HttpContextContract) {
        const picture = request.file('picture')
        let picture_name = 'default.png'
        if (picture) {
            picture_name = `${new Date().getTime()}.${picture.extname}`

            await picture.move(Application.tmpPath('uploads'), {
                name: picture_name,
                overwrite: true,
            })
        }

        const attrs = request.only([
            'name',
            'lastname',
            'email',
            'password',
            'tirper'
        ])
        const user = new User()
        user.name = attrs.name
        user.lastname = attrs.lastname
        user.email = attrs.email
        user.password = attrs.password
        user.picture = picture_name
        user.roles = attrs.tirper ? 'tirper' : ''

        if ( await bouncer.allows('isAdmin') ) {
            const roles = request.only(['roles'])
            user.roles += ` ${roles.roles}`
        }

        if (await user.save())
            return Responses.success(user)
        else
            return Responses.error(response)
    }

    async update({ params, request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        let session = auth.use('api').user!
        let user
        if( await bouncer.allows('isSelf', session) )
            user = session
        if ( await bouncer.allows('isAdmin') && params.id)
            user = await User.find(params.id)

        if (!user) return Responses.error(response)

        const attrs = request.only([
            'name',
            'lastname',
            'email',
            'password',
        ])

        user.name = attrs.name
        user.lastname = attrs.lastname
        user.email = attrs.email
        user.password = attrs.password

        const picture = request.file('picture_new');

        if( picture ) {
            if ( user.picture != 'default.png' )
                await fs.unlinkSync( `${Application.appRoot}/tmp/uploads/${user.picture}` )
            let name = `${user.picture.split('.')[0]}.${picture.extname}`
            await picture.move(Application.tmpPath('uploads'), {
                name: name,
                overwrite: false,
            })
            user.picture = name
        }

        user.save()

        return Responses.success(user)
    }

    async destroy({ params, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        let session = auth.use('api').user!
        let user
        if( await bouncer.allows('isSelf', session) )
            user = session
        if ( await bouncer.allows('isAdmin') && params.id)
            user = await User.find(params.id)

        if (!user) return Responses.error(response)

        if ( user.picture != 'default.png' )
            await fs.unlinkSync( `${Application.appRoot}/tmp/uploads/${user.picture}` )

        await user.delete()

        return Responses.success(true)
    }

    async addLanguage({ params, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        let user = auth.use('api').user!

        const lang = await Language.findOrFail(params.id)
        await user.related('languages').save(lang)

        return Responses.success(await user.related('languages').query())
    }

    async removeLanguage({ params, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        let user = auth.use('api').user!
        
        await user.related('languages').detach([params.id])

        return Responses.success(await user.related('languages').query())
    }

    async indexLanguage({ auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        let user = auth.use('api').user!

        return Responses.success(await user.related('languages').query())
    } 
}
