import { getDbConnection } from "@/models/db";
import { Photos } from "@/models/schema";
import fs from "node:fs";

const teste = async () => {
  const db = await getDbConnection();

  const image = fs.readFileSync("./automatic.png");

  console.log("meu Deusssssssss: ", image.toString("base64"));

  fs.writeFileSync("./public/automatic2.png", image.toString("base64"), {
    encoding: "base64",
  });

  const result = (
    await db.insert(Photos).values({
      localeId: 2,
      name: "2.png",
      url: "/public/automatic2.png",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  )[0];

  console.log("\n\nresult: ", result);
};

export default teste;
