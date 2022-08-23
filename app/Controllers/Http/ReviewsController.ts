import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Responses from "App/Helpers/Responses"
import Tour from 'App/Models/Tour'
import Review from 'App/Models/Review'



export default class ReviewsController {

    async index({ auth, bouncer, response}: HttpContextContract) {
        await auth.use('api').authenticate()
        if ( !await bouncer.allows('isAdmin') )
            return Responses.error(response)
        let reviews = (await Review.query()
            .preload('tour')
            .preload('reviewer'))
            .map( review => review.serialize())
        return Responses.success(reviews)
    }

    async show({ params }) {
        let Reviews = (await Review.query()
            .where('tour_id', params.id)
            .preload('tour')
            .preload('reviewer'))
            .map( Review => Review.serialize())
        return Responses.success(Reviews)
    }

    async store({ request, response, auth }: HttpContextContract) {
        await auth.use('api').authenticate()
        const user = auth.use('api').user!

        const attrs = request.only([
            'tour_id',
            'description',
            'title',
            'rating'
        ])
        
        const tour = await Tour.findOrFail(attrs.tour_id)

        if (user.id != tour.ownerId || attrs.rating > 5)
            return Responses.error(response)

        const review = new Review()

        review.title = attrs.title
        review.description = attrs.description
        review.rating = attrs.rating
        review.related('tour').associate(tour)
        review.related('reviewer').associate(user)

        if (await review.save())
            return Responses.success(review.serialize())
        else
            return Responses.error(response)
    }
}
