const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS   // Gmail App Password (not your real password)
  }
});

async function sendMatchEmail(toEmail, toName, itemName, matchName) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return; // skip if not configured

  const mailOptions = {
    from: `"FindIt App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎯 Possible match found for your item — ${itemName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#2563EB;">🔍 FindIt — Match Alert!</h2>
        <p>Hi <strong>${toName}</strong>,</p>
        <p>Great news! We found a possible match for your item:</p>
        <div style="background:#EFF6FF;border-radius:12px;padding:16px;margin:16px 0;">
          <p style="margin:0;font-weight:700;color:#1D4ED8;">Your item: ${itemName}</p>
          <p style="margin:8px 0 0;color:#374151;">↔ Matched with: <strong>${matchName}</strong></p>
        </div>
        <p>Log in to FindIt to view the full details and contact the other person.</p>
        <a href="${process.env.APP_URL || 'http://localhost:5000'}"
           style="display:inline-block;background:#2563EB;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:8px;">
          View Match →
        </a>
        <p style="margin-top:24px;font-size:12px;color:#9CA3AF;">FindIt Lost & Found Management System</p>
      </div>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Match email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
}

async function sendReportConfirmEmail(toEmail, toName, itemName, type) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const mailOptions = {
    from: `"FindIt App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ Your ${type} item report has been submitted — ${itemName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#2563EB;">✅ Report Submitted!</h2>
        <p>Hi <strong>${toName}</strong>,</p>
        <p>Your <strong>${type}</strong> item report for <strong>"${itemName}"</strong> has been submitted successfully.</p>
        <p>We'll notify you immediately if a match is found!</p>
        <a href="${process.env.APP_URL || 'http://localhost:5000'}"
           style="display:inline-block;background:#2563EB;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:8px;">
          View My Report →
        </a>
        <p style="margin-top:24px;font-size:12px;color:#9CA3AF;">FindIt Lost & Found Management System</p>
      </div>`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
}

module.exports = { sendMatchEmail, sendReportConfirmEmail };
