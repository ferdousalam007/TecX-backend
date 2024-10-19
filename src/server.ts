import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';



let server: Server;
// async function addNewFieldToExistingDocuments() {
//   try {
//     const result = await Post.updateMany(
//       {},
//       { $set: { isDeleted: false } }
//     );
//     console.log(`${result.modifiedCount} documents updated.`);
//   } catch (error) {
//     console.error('Error updating documents:', error);
//   }
// }
async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    server = app.listen(config.PORT, () => {

      console.log(`App is listening on port ${config.PORT}`);
    });
  } catch (err) {

    console.log(err);
  }
}
main();


process.on('unhandledRejection', () => {
  console.log(`😈 Unhandled rejection is detected, shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
process.on('uncaughtException', () => {
  console.log(`😈 Uncaught Exception is detected, shutting down ...`);
  process.exit(1);
});
