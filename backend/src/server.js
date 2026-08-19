const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`==================================================`);
      console.log(`  Pulsely Resilient Backend Service Started       `);
      console.log(`  Environment : ${env.NODE_ENV}`);
      console.log(`  Listening on: http://localhost:${env.PORT}`);
      console.log(`==================================================`);
    });
  } catch (error) {
    console.error(`Failed to start Pulsely server: ${error.message}`);
  }
};

startServer();
