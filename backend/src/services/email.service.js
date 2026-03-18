import transporter from "../config/mailer.js";
import { prisma } from "../config/prisma.js";

const sendInterviewReminder = async (user, job) => {
  const subject = `Interview Reminder: ${job.roleTitle} at ${job.companyName}`;

  const html = `
    <h2>Interview Reminder</h2>
    <p>Hello ${user.name},</p>
    <p>This is a reminder for your upcoming interview.</p>
    <ul>
      <li><strong>Company:</strong> ${job.companyName}</li>
      <li><strong>Role:</strong> ${job.roleTitle}</li>
      <li><strong>Date:</strong> ${new Date(job.interviewDate).toLocaleString()}</li>
    </ul>
    <p>Good luck!</p>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: user.email,
    subject,
    html,
  });

  await prisma.emailLog.create({
    data: {
      userId: user.id,
      jobId: job.id,
      type: "INTERVIEW_REMINDER",
      status: "SENT",
    },
  });
};

export default {
  sendInterviewReminder,
};