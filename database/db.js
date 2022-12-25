const mongoose = require("mongoose");

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );

    console.log(`MongoDB Connected :  ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
