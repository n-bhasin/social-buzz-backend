import { database, down } from "migrate-mongo";

const runDown = async () => {
  console.log("Migrating down starting...");
  const { db } = await database.connect();
  await down(db);
  await db.close();
  console.log("Migrating down is completed");
  return true;
};

runDown();
