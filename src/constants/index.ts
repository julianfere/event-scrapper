import { configDotenv } from "dotenv";

configDotenv();

export const WEEKLY_AGENDA_URL = process.env.WEEKLY_AGENDA_URL ?? "";
export const WEEKLY_FOOD_URL = process.env.WEEKLY_FOOD_URL ?? "";
