import { createClient } from 'jsr:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const WAITLIST_ID = 3
const SENDER = { name: 'OUMAR', email: 'oumar.ka60@gmail.com' }

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

async function notifyBrevo(apiKey: string, email: string) {
  const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      listIds: [WAITLIST_ID],
      updateEnabled: true,
    }),
  })
  if (!contactRes.ok && contactRes.status !== 204) {
    throw new Error(`brevo contact ${contactRes.status} ${await contactRes.text()}`)
  }

  const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email }],
      subject: "You're in",
      htmlContent: `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:32px 20px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#171717;">
    <p style="margin:0 0 16px;font-size:16px;">Thanks for subscribing.</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">We'll keep you posted when the Stiff™ Jacket is ready.</p>
    <p style="margin:24px 0 0;font-size:14px;color:#888;">OUMAR</p>
  </body>
</html>`,
      textContent:
        "Thanks for subscribing. We'll keep you posted when the Stiff™ Jacket is ready.\n\nOUMAR",
    }),
  })
  if (!emailRes.ok) {
    throw new Error(`brevo email ${emailRes.status} ${await emailRes.text()}`)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  try {
    const payload = await req.json()
    const email = String(payload?.email || payload?.record?.email || '')
      .trim()
      .toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'Enter a valid email' }, 400)
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    const { data: apiKey, error: keyError } = await admin.rpc(
      'get_brevo_api_key',
    )
    if (keyError || !apiKey) {
      console.error('brevo key', keyError)
      return json({ ok: false, error: 'Welcome email is not configured.' }, 500)
    }

    await notifyBrevo(String(apiKey), email)
    return json({ ok: true })
  } catch (err) {
    console.error('waitlist-welcome', err)
    return json(
      { ok: false, error: 'Could not send the welcome email.' },
      500,
    )
  }
})
