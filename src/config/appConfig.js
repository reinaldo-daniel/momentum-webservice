import "dotenv/config";

const { env: environment } = process;

const appConfig = {
    appPort: environment.APP_PORT,
};

export default appConfig;
