import fs from "fs";
import snowflake from "snowflake-sdk";

let connection: snowflake.Connection | null = null;

function getPrivateKey(): string {
  if (process.env.SNOWFLAKE_PRIVATE_KEY_BASE64) {
    return Buffer.from(process.env.SNOWFLAKE_PRIVATE_KEY_BASE64, "base64").toString("utf8");
  }

  if (process.env.SNOWFLAKE_PRIVATE_KEY_PATH) {
    return fs.readFileSync(process.env.SNOWFLAKE_PRIVATE_KEY_PATH, "utf8");
  }

  throw new Error("No Snowflake private key configured");
}

export async function getSnowflakeConnection(): Promise<snowflake.Connection> {
  if (connection) return connection;

  connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USER!,
    database: process.env.SNOWFLAKE_DATABASE!,
    schema: process.env.SNOWFLAKE_SCHEMA!,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
    role: process.env.SNOWFLAKE_ROLE!,
    authenticator: "SNOWFLAKE_JWT",
    privateKey: getPrivateKey(),
  });

  await new Promise<void>((resolve, reject) => {
    connection!.connect((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  return connection;
}

export async function runQuery<T>(sqlText: string, binds: any[] = []): Promise<T[]> {
  const conn = await getSnowflakeConnection();

  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) reject(err);
        else resolve((rows ?? []) as T[]);
      },
    });
  });
}
