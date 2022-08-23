import Tour from "App/Models/Tour";
import User from "App/Models/User";
import Invitation from "App/Models/Invitation";

const create = async (invitee: User, tour: Tour) => {
    const invitation = new Invitation()
    await invitation.related('tirper').associate(invitee)
    await invitation.related('tour').associate(tour)
    return await invitation.save()
}

const inviteTirpers = async (tour: Tour) => {
    const users = await User.query().whereHas('languages', (langQuery) => {
        langQuery.where('language_id', '=', tour.languageId)
    })

    for (const user of users) {
        await create(user, tour)
    }
}

export default {
    create: create,
    inviteTirpers: inviteTirpers
}