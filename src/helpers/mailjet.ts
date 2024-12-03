import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
  options: {
    timeout: 15000,
  },
});

export const defaultFrom = {
  email: process.env.MAILJET_FROM_EMAIL,
  name: process.env.MAILJET_FROM_NAME,
};

export const adminInfo = {
  email: process.env.ADMIN_EMAIL,
  name: process.env.ADMIN_NAME,
};

export default mailjet;
