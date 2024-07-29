import { APP_ENV } from "./config";

const BASE_URL = APP_ENV == "dev" ? "https://us-central1-kopaville-dev.cloudfunctions.net/" : "https://us-central1-kopaville-prod.cloudfunctions.net/"
export const BLOCK_USER_PATH =
    `${BASE_URL}blockUser`;
export const UNBLOCK_USER_PATH =
    `${BASE_URL}unBlockUser`;
export const DELETE_ACCOUNT =
    `${BASE_URL}deleteUser`;

