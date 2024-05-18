function requestLogger(request, response, next) {
    const start = Date.now();

    response.on("finish", () => {
        const end = Date.now();
        const responseTime = end - start;

        console.info(
            `Método: ${request.method} | URL: ${request.originalUrl} | Status: ${response.statusCode} | Tempo de espera: ${responseTime}ms`,
        );
    });

    next();
}

export default requestLogger;
