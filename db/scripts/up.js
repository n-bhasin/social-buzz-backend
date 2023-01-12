import { database, up } from "migrate-mongo";

const runUp = async () => {
  console.log("Migrating up starting...");
  const { db } = await database.connect();
  await up(db);
  await db.close();
  console.log("Migrating up is completed");
  return true;
};

runUp();
