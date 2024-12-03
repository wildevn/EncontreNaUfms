import type { Locale as CreateLocale } from "@/services/localesServices/createLocaleService";
import mailjet, { defaultFrom, adminInfo } from "./mailjet";

const sendSuggestionEmail = async (
  locale: CreateLocale,
  newLocale: boolean,
  userEmail: string,
  userName: string,
) => {
  try {
    const attachments: Array<{
      ContentType: string;
      Filename: string;
      Base64Content: string;
    }> = [];

    const localeToSend = {
      ...locale,
      photos:
        locale.photos && locale.photos.length > 0
          ? locale.photos.map((photo) => {
              return { id: photo?.id || -1, name: photo.name, data: "" };
            })
          : [],
    };
    const htmlEmail = `<div style="width: 100%; height: 100%; background-color: #0088B7; padding: 10px 15px; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: Helvetica; flex-wrap: wrap;">
      <h1>Encontre na UFMS - Sugestão de ${newLocale ? "novo" : "alteração de"} local:</h1>
    <div style="background-color: #1F1F1F; width: 90%; padding: 10px 25px; border-radius: 5px; color: white; word-break: break-word;">
      <span> 
        <pre>${JSON.stringify(localeToSend, null, 2)}<pre>
      </span>
    </div>
  </div>`;

    const messages = [
      {
        From: {
          Email: defaultFrom.email,
          Name: defaultFrom.name,
        },
        To: [
          {
            Email: adminInfo.email,
            Name: adminInfo.name,
          },
        ],
        Subject: `Sugestão de ${newLocale ? "novo" : "alteração de"} local: ${locale.name}`,
        TextPart: `Sugerido por ${userName}: ${userEmail}`,
        HTMLPart: htmlEmail,
      },
    ];

    if (locale?.photos && locale.photos.length > 0) {
      for (const photo of locale.photos) {
        if (photo.data) {
          attachments.push({
            ContentType: `image/${photo.name.split(".")[1]}`,
            Filename: photo.name,
            Base64Content: photo.data,
          });
        }
      }
      if (attachments.length > 0) {
        attachments.push({
          ContentType: "text/plain",
          Filename: "imagesObject.txt",
          Base64Content: Buffer.from(
            JSON.stringify(locale.photos),
            "utf-8",
          ).toString("base64"),
        });
        messages[0].Attachments = attachments;
      }
    }

    const emailRequest = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: messages,
      });

    return { result: "OK", status: 200 };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error", error.message);
    } else {
      console.log("error", error);
    }
    return { status: 500, result: `Error: ${error}` };
  }
};

export default sendSuggestionEmail;
