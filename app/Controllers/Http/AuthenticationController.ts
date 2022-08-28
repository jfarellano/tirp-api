import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Responses from "App/Helpers/Responses"


export default class AuthenticationController {
    async login({ auth, request, response }:HttpContextContract) {
        const credentials = request.only([ 'email', 'password'])
        try {
            const token = await auth.use('api').attempt(credentials.email, credentials.password)
            const user = auth.use('api').user!
            return Responses.success({token, user})
        } catch {
            return response.badRequest('Invalid credentials')
        }
    }
}
