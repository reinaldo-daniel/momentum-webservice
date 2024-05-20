export default function preconditionFailedError(response, message) {
    const messageToSend = message || "Preconditional failed error";

    response.status(409)
        .json({ message: messageToSend });
}
