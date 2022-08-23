import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Country from "App/Models/Country"
import Responses from "App/Helpers/Responses"
const fs = require('fs')


export default class CountriesController {
    async index({auth, bouncer, response}: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)
        let countries = await Country.all()
        return Responses.success(countries)
    }

    async show({ params, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)

        let country = await Country.find(params.id)
        if (country)
            return Responses.success({
                ...country.serialize(),
            })
        else
            return Responses.error(response);
    }

    async store({ request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)
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
            'person_value',
            'time_value'
        ])
        const country = new Country()
        country.name = attrs.name
        country.personValue = attrs.person_value
        country.timeValue = attrs.time_value
        country.picture = picture_name

        if (await country.save())
            return Responses.success(country)
        else
            return Responses.error(response)
    }

    async update({ params, request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)
        let country = await Country.find(params.id)

        if (!country) return Responses.error(response)

        const attrs = request.only([
            'name',
            'person_value',
            'time_value'
        ])

        country.name = attrs.name
        country.personValue = attrs.person_value
        country.timeValue = attrs.time_value

        const picture = request.file('picture_new');

        if( picture ) {
            if ( country.picture != 'default.png' )
                await fs.unlinkSync( `${Application.appRoot}/tmp/uploads/${country.picture}` )
            let name = `${country.picture.split('.')[0]}.${picture.extname}`
            await picture.move(Application.tmpPath('uploads'), {
                name: name,
                overwrite: false,
            })
            country.picture = name
        }

        country.save()

        return Responses.success(country)
    }

    async destroy({ params, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)

        let country = await Country.find(params.id)

        if (!country) return Responses.error(response)

        if ( country.picture != 'default.png' )
            await fs.unlinkSync( `${Application.appRoot}/tmp/uploads/${country.picture}` )

        await country.delete()

        return Responses.success(true)
    }
}
