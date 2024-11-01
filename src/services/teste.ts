import { getDbConnection } from "@/models/db";
import { Photos } from "@/models/schema";
import fs from "node:fs";

const teste = async () => {
  const db = await getDbConnection();

  const image = fs.readFileSync("./Logo.jpeg");
  const result = (
    await db.insert(Photos).values({
      localeId: 1,
      name: "Logo2.jpeg",
      data: image.toString("base64"),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  )[0];

  console.log("result: ", result);
};

export default teste;
