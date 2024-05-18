export default function unauthorized(response, message) {
    const messageToSend = message || "Unauthorized";

    response.status(401)
        .json({ message: messageToSend });
}
