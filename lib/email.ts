import { Resend } from 'resend';

// Switch to your verified domain once stunion.site is registered
const FROM = 'Stunion <onboarding@resend.dev>';

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendBookingNotificationToTutor({
  tutorEmail,
  tutorName,
  parentEmail,
  studentName,
  bookingDate,
  durationMinutes,
  subjectFocus,
  grossAmount,
}: {
  tutorEmail: string;
  tutorName: string;
  parentEmail: string;
  studentName: string;
  bookingDate: string;
  durationMinutes: number;
  subjectFocus?: string;
  grossAmount: number;
}) {
  const date = new Date(bookingDate).toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul',
  });

  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: tutorEmail,
    subject: `[Stunion] New booking request from ${studentName}`,
    html: `
      <p>Hi ${tutorName},</p>
      <p>You have a new booking request on Stunion.</p>
      <table style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="padding:6px 0;color:#6b7280">Student</td><td style="padding:6px 0;font-weight:600">${studentName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Date &amp; time</td><td style="padding:6px 0;font-weight:600">${date} (KST)</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Duration</td><td style="padding:6px 0;font-weight:600">${durationMinutes} min</td></tr>
        ${subjectFocus ? `<tr><td style="padding:6px 0;color:#6b7280">Focus</td><td style="padding:6px 0">${subjectFocus}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#6b7280">Session amount</td><td style="padding:6px 0;font-weight:600">₩${grossAmount.toLocaleString()}</td></tr>
      </table>
      <p style="margin-top:1.5rem">
        <a href="https://stunion.site/dashboard" style="background:#4338ca;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          Accept or decline →
        </a>
      </p>
      <p style="color:#9ca3af;font-size:0.85rem">Parent contact: ${parentEmail}</p>
    `,
  });
}

export async function sendBookingConfirmationToParent({
  parentEmail,
  studentName,
  tutorName,
  bookingDate,
  durationMinutes,
  grossAmount,
  feeWaived,
}: {
  parentEmail: string;
  studentName: string;
  tutorName: string;
  bookingDate: string;
  durationMinutes: number;
  grossAmount: number;
  feeWaived: boolean;
}) {
  const date = new Date(bookingDate).toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul',
  });
  const fee = feeWaived ? 0 : Math.round(grossAmount * 0.1);

  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: parentEmail,
    subject: `[Stunion] Booking request sent — ${tutorName}`,
    html: `
      <p>Your booking request has been sent to <strong>${tutorName}</strong>.</p>
      <p>They have 24 hours to accept. You will receive another email when they respond. Payment is collected only after acceptance.</p>
      <table style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="padding:6px 0;color:#6b7280">Student</td><td style="padding:6px 0;font-weight:600">${studentName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Tutor</td><td style="padding:6px 0;font-weight:600">${tutorName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Date &amp; time</td><td style="padding:6px 0;font-weight:600">${date} (KST)</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Duration</td><td style="padding:6px 0;font-weight:600">${durationMinutes} min</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Session amount</td><td style="padding:6px 0;font-weight:600">₩${grossAmount.toLocaleString()}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Platform fee</td><td style="padding:6px 0">${feeWaived ? 'Waived (promo)' : `₩${fee.toLocaleString()}`}</td></tr>
      </table>
      <p style="margin-top:1.5rem">
        <a href="https://stunion.site/my-bookings" style="background:#4338ca;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          View my bookings →
        </a>
      </p>
      <p style="color:#9ca3af;font-size:0.85rem">Questions? Reply to this email or contact andyyan0806@gmail.com</p>
    `,
  });
}
