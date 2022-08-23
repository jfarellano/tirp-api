// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import City from "App/Models/City"
import Country from "App/Models/Country"
import Responses from "App/Helpers/Responses"
const fs = require('fs')

export default class CitiesController {
    async index() {
        let cities = await City.query().preload('country')
        return Responses.success(cities)
    }

    async show({ params, response }) {
        let city = await City.query().where(
            'id',
            '=',
            params.id
        ).preload('country')

        if (city)
            return Responses.success({
                ...city,
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

        const attrs = request.only(['name', 'country_id'])
        const city = new City()
        city.name = attrs.name
        city.picture = picture_name

        const country = await Country.findOrFail(attrs.country_id)

        await city.related('country').associate(country)

        // return Responses.success(city)
        if (await city.save())
            return Responses.success(city)
        else
            return Responses.error(response)
    }

    async update({ params, request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)

        let city = await City.find(params.id)

        if (!city) return Responses.error(response)

        city.name = request.body().name

        const picture = request.file('picture_new');

        if( picture ) {
            if ( city.picture != 'default.png' )
                await fs.unlinkSync( `${Application.appRoot}/tmp/uploads/${city.picture}` )
            let name = `${city.picture.split('.')[0]}.${picture.extname}`
            await picture.move(Application.tmpPath('uploads'), {
                name: name,
                overwrite: false,
            })
            city.picture = name
        }

        city.save()

        return Responses.success(city)
    }

    async destroy({ params, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)

        let city = await City.find(params.id)
        
        if (!city) return Responses.error(response)

        if ( city.picture != 'default.png' )
            await fs.unlinkSync( `${Application.appRoot}/tmp/uploads/${city.picture}` )

        await city.delete()

        return Responses.success(true)
    }
}
