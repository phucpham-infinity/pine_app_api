import { Schema } from "mongoose";

export const createSchema = (schema: any) => {
  return new Schema({
    ...schema,
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
  });
};

export interface IBaseModal {
  createdAt: Date;
  updatedAt: Date;
  doc: () => Partial<any>;
}
