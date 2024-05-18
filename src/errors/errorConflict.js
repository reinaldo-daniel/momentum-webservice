export default function conflict(response, message) {
    const messageToSend = message || "Conflict";

    response.status(409)
        .json({ message: messageToSend });
}
