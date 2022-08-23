import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Language from "App/Models/Language"
import Responses from "App/Helpers/Responses"


export default class LanguagesController {
    async index() {
        let languages = await Language.all()
        return Responses.success(languages)
    }

    async show({ params, response }) {
        let language = await Language.find(params.id)
        if (language)
            return Responses.success({
                ...language.serialize(),
            })
        else
            return Responses.error(response);
    }

    async store({ request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)

        const attrs = request.only(['name'])
        const language = new Language()
        language.name = attrs.name

        if (await language.save())
            return Responses.success(language)
        else
            return Responses.error(response)
    }

    async update({ params, request, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)

        let language = await Language.find(params.id)

        if (!language) return Responses.error(response)

        language.name = request.body().name
        
        if ( await language.save() ) 
            return Responses.success(language)
        else 
            return Responses.error('Failed updating language')
    }

    async destroy({ params, response, auth, bouncer }: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)
            
        let language = await Language.find(params.id)

        if (!language) return Responses.error(response)
        
        await language.delete()
        return Responses.success(true)
    }
}
