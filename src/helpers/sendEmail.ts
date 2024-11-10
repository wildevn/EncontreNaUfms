import mailjet, { defaultFrom } from "./mailjet";

const sendEmail = async (
  userName: string,
  userEmail: string,
  token: number,
) => {
  // change token to a deep link with it.
  try {
    const htmlEmail = `<div style="width: 100%; height: 100%; background-color: #0088B7; padding: 10px 15px; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: Helvetica; flex-wrap:">
                        <h1>Encontre Na Ufms app</h1>
                        <div style="background-color: #1F1F1F; width: 90%; padding: 10px 25px; border-radius: 5px; color: white; word-break: break-all;">
                          <h3> Recebemos sua solicitação para recuperação de senha </h3>
                          <p style="padding-top: 40px;"> Copie o token abaixo e o cole no seu aplicativo para continuar o processo de recuperação </p>
                          <span> 
                            <strong> token: </strong> ${token}
                          </span>
                          <p style="padding-top: 50px;"> Caso você <strong>não tenha solicitado</strong> token de recuperação, favor ignorar este email.</p>
                        </div>
                      </div>`;

    const emailRequest = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: defaultFrom.email,
              Name: defaultFrom.name,
            },
            To: [
              {
                Email: userEmail,
                Name: userName,
              },
            ],
            Subject: "Encontre na UFMS - Recuperação de senha",
            TextPart: `Seu token de recuperação de senha é: ${token}`,
            HTMLPart: htmlEmail,
          },
        ],
      });
    return emailRequest;
  } catch (error) {
    return error;
  }
};

export default sendEmail;
