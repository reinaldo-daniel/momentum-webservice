export default function badRequest(response, message) {
    const messageToSend = message || "Bad Request";

    response.status(400)
        .json({ message: messageToSend });
}
