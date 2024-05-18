import bcrypt from "bcrypt";

function generatePassword(password) {
    const salt = bcrypt.genSaltSync(10);

    const hashPassword = bcrypt.hashSync(password, salt);

    console.info(`A senha gerada é: ${hashPassword}`);
}

const password = process.argv[2];
generatePassword(password);
