export default function fobidden(response, message) {
    const messageToSend = message || "Forbidden";

    response.status(403)
        .json({ message: messageToSend });
}
