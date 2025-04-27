import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // or "hotmail", "outlook", or use custom SMTP
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // your app password (not your email password)
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const mailOptions = {
    from: `"ClientSphere" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
};

export default sendMail;
