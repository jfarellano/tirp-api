export default {

    success: ( body ) => {
        return {
            status: 'success',
            message: 'tour request was succesfully processed',
            body: body
        }
    },
    error: ( response ) => {
        response.status(400)

        return {
            status: 'error',
            message: 'there was an error processing your request',
        }
    }
}