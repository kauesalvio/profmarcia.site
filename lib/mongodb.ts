import { type Db, MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  retryWrites: true,
  w: "majority",
};

if (!uri) {
  throw new Error("A variável de ambiente MONGODB_URI não está definida.");
}

declare global {
  var __informaticClassMongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === "development" && global.__informaticClassMongoClient) {
  client = global.__informaticClassMongoClient;
} else {
  client = new MongoClient(uri, options);
  if (process.env.NODE_ENV === "development") {
    global.__informaticClassMongoClient = client;
  }
}

export async function getClient(): Promise<MongoClient> {
  await client.connect();
  return client;
}

export async function getDatabase(name = "escola"): Promise<Db> {
  const connected = await getClient();
  return connected.db(name);
}

export async function closeClient(): Promise<void> {
  await client.close();
  if (process.env.NODE_ENV === "development") {
    global.__informaticClassMongoClient = undefined;
  }
}
