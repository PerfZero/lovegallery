import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createRequest } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      formType,
      name,
      email,
      phone,
      subject,
      message,
      product,
      price,
      options,
    } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Beloved Website" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_TO,
      replyTo: email,
      subject: `Новая заявка: ${subject || formType}`,
      text: `
                Тип формы: ${formType}
                Имя: ${name}
                Email: ${email}
                Телефон: ${phone}
                Тема: ${subject}

                Сообщение:
                ${message}
            `,
      html: `
                <h3>Новая заявка с сайта Beloved</h3>
                <p><strong>Тип формы:</strong> ${formType}</p>
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Телефон:</strong> ${phone}</p>
                <p><strong>Тема:</strong> ${subject}</p>
                <br>
                <p><strong>Сообщение:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
            `,
    };

    await transporter.sendMail(mailOptions);

    // Store request in DB
    try {
      createRequest({
        formType,
        name,
        email,
        phone,
        subject,
        message,
        product,
        price,
        options,
      });
    } catch (dbErr) {
      console.error("Failed to store request:", dbErr);
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
