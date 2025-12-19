import 'dotenv/config';

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing env var: ${name}`);
    }
    return value;
}

export const db_args = {
    DB_HOST: required('DB_HOST'),
    DB_PORT: Number(required("DB_PORT")),
    DB_USER: required("DB_USER"),
    DB_PASSWORD: required("DB_PASSWORD"),
    DB_NAME: required("DB_NAME")
};

if (isNaN(db_args.DB_PORT)) {
    throw new Error("DB_PORT must be a number.")
}
