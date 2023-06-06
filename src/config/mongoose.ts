import mongoose from "mongoose";

type TInput = {
  db: string;
};

export const mongooseConnect = ({ db }: TInput) => {
  const connect = () => {
    mongoose
      .connect(db, { dbName: "pina_app" })
      .then((res) => {
        return console.info(`Successfully connected to ${res.connection.name}`);
      })
      .catch((error) => {
        console.error("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
