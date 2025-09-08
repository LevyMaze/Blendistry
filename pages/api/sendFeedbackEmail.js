import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, feedback } = req.body;

  if (!username || !feedback) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const dateTime = new Date().toLocaleString();

    await transporter.sendMail({
      from: `"Blendistry Feedback" <${process.env.SMTP_USER}>`,
      to: "LevyMaze@gmail.com", // your email
      subject: `New Feedback from ${username}`,
      html: `
        <h2>New Feedback Submitted</h2>
        <p><strong>Time:</strong> ${dateTime}</p>
        <p><strong>User:</strong> ${username}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        <p><strong>Feedback:</strong></p>
        <p>${feedback.replace(/\n/g, "<br>")}</p>
      `,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
}
