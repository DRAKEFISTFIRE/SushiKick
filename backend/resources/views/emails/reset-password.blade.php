<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Recuperar contraseña</title>
</head>
<body style="margin:0; padding:0; background-color:#0d0805; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0805; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px; background:#1a0e07; border:1px solid rgba(255,248,240,0.08); border-radius:20px; overflow:hidden;">

          <tr>
            <td style="padding: 32px 32px 0; text-align:center;">
              <div style="font-size:0.7rem; letter-spacing:0.2em; color:rgba(255,248,240,0.25); text-transform:uppercase;">管理 — SushiKick</div>
              <h1 style="color:#fff8f0; font-size:1.5rem; letter-spacing:0.05em; margin: 12px 0 0;">
                Recupera tu contraseña
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px 0; color: rgba(255,248,240,0.65); font-size:0.95rem; line-height:1.6;">
              <p>Hola <strong style="color:#fff8f0;">{{ $nombre }}</strong>,</p>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva.</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px;" align="center">
              <a href="{{ $resetUrl }}"
                 style="display:inline-block; padding: 14px 32px; border-radius:10px;
                        background: linear-gradient(135deg, #c8201a, #f07b10);
                        color:#fff8f0; text-decoration:none; font-weight:600; font-size:0.9rem;
                        letter-spacing:0.04em; box-shadow: 0 0 20px rgba(200,32,26,0.3);">
                🔑 Restablecer contraseña
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px 32px; color: rgba(255,248,240,0.4); font-size:0.8rem; line-height:1.6;">
              <p>Este enlace caduca en 60 minutos. Si no has solicitado este cambio, puedes ignorar este correo.</p>
              <p style="word-break:break-all; color: rgba(255,248,240,0.3);">
                O copia este enlace en tu navegador:<br>{{ $resetUrl }}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 16px 32px; border-top:1px solid rgba(255,248,240,0.06); text-align:center;">
              <span style="color: rgba(255,248,240,0.25); font-size:0.72rem; letter-spacing:0.14em; text-transform:uppercase;">
                © {{ date('Y') }} SushiKick
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>