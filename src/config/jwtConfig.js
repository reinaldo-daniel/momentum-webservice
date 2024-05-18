import "dotenv/config";

const { env: environment } = process;

const jwtConfig = {
    jwtSecret: environment.JWT_SECRET,
};

export default jwtConfig;
