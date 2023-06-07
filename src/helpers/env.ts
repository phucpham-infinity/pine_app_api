import * as dotenv from "dotenv";
dotenv.config();

export const env = (name: string) => process.env?.[name] as string;
