import { env } from '../config/env.js'

/**
 * Send a transactional email through the self-hosted mail gateway
 * (mailapi.artdevelopers.site -> docker-mailserver). No third-party provider.
 * Uses the global fetch (Node 18+), so no extra dependency is required.
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!env.mailApiUrl || !env.mailApiKey) {
    throw new Error('Mail gateway is not configured (MAILAPI_URL / MAILAPI_KEY)')
  }

  const res = await fetch(`${env.mailApiUrl.replace(/\/$/, '')}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': env.mailApiKey,
    },
    body: JSON.stringify({
      to,
      subject,
      html,
      text: text || undefined,
      from: env.mailFrom,
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === false) {
    throw new Error(`Mail send failed (${res.status}): ${data.error || 'unknown error'}`)
  }
  return data
}

export function buildResetEmail(resetUrl) {
  return {
    subject: 'Reset your Fablet password',
    html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your Fablet password</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
            <!-- Brand header -->
            <tr>
              <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:28px 32px;">
                <span style="display:inline-block;font-size:22px;font-weight:800;letter-spacing:0.5px;color:#ffffff;">Fablet</span>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:32px 32px 8px;">
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f172a;font-weight:700;">Reset your password</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">
                  We received a request to reset your Fablet password. Click the button below to choose a new one.
                  This secure link expires in <strong style="color:#0f172a;">15 minutes</strong>.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td align="center" style="border-radius:10px;background:#2563eb;">
                      <a href="${resetUrl}" target="_blank"
                         style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:'Segoe UI',system-ui,Arial,sans-serif;">
                        Reset my password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#94a3b8;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.5;word-break:break-all;color:#2563eb;">
                  <a href="${resetUrl}" style="color:#2563eb;text-decoration:none;">${resetUrl}</a>
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
                  If you didn't request this, you can safely ignore this email &mdash; your password won't change.
                  For help, contact <a href="mailto:support@fablet.artdevelopers.site" style="color:#64748b;">support@fablet.artdevelopers.site</a>.
                </p>
                <p style="margin:12px 0 0;font-size:12px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} Fablet. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  }
}

export function buildVerificationEmail(verifyUrl) {
  const year = new Date().getFullYear()
  return {
    subject: 'Activate your Fablet account',
    html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Activate your Fablet account</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',system-ui,-apple-system,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:28px 32px;">
                <span style="display:inline-block;font-size:22px;font-weight:800;letter-spacing:0.5px;color:#ffffff;">Fablet</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 8px;">
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f172a;font-weight:700;">Activate your account</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">
                  Thanks for joining Fablet! Confirm your email address to activate your account and
                  start building. This secure link expires in <strong style="color:#0f172a;">15 minutes</strong>.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td align="center" style="border-radius:10px;background:#2563eb;">
                      <a href="${verifyUrl}" target="_blank"
                         style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:'Segoe UI',system-ui,Arial,sans-serif;">
                        Activate my account
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#94a3b8;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.5;word-break:break-all;color:#2563eb;">
                  <a href="${verifyUrl}" style="color:#2563eb;text-decoration:none;">${verifyUrl}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
                  If you didn't create a Fablet account, you can safely ignore this email.
                  For help, contact <a href="mailto:support@fablet.artdevelopers.site" style="color:#64748b;">support@fablet.artdevelopers.site</a>.
                </p>
                <p style="margin:12px 0 0;font-size:12px;color:#cbd5e1;">&copy; ${year} Fablet. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  }
}
