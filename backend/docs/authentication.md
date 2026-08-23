# WhatsApp authentication

This API uses Twilio Verify to deliver and check WhatsApp OTPs. SapiGo stores a
stateless, signed JWT in a host-only browser cookie; it does not store session
rows or refresh tokens.

## Required configuration

Copy `.env.example` to `.env` and set `TWILIO_ACCOUNT_SID`,
`TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`, and a strong
`AUTH_JWT_SECRET`. Set `AUTH_FRONTEND_ORIGIN` to the exact HTTPS frontend
origin. Local HTTP development must use `AUTH_COOKIE_SECURE=false`.

## Browser flow

1. `POST /api/auth/otp/request` with `{"whatsapp_number":"+628123456789"}`.
2. `POST /api/auth/otp/verify` with the number and WhatsApp code. On success,
   the response sets `sapigo_access` (HttpOnly) and `sapigo_csrf` (readable).
3. Send browser requests with credentials enabled. For `POST /profile` and
   `POST /logout`, copy the `sapigo_csrf` cookie into the `X-CSRF-Token` header
   and include the configured frontend `Origin` header.
4. Fetch the signed-in user through `GET /api/auth/me`.

`POST /api/auth/profile` accepts `{"full_name":"Ada Lovelace"}` and updates
the current user. Verification creates a user automatically if the phone number
is new, so profile completion is optional in this simplified release.

`POST /api/auth/logout` clears the two browser cookies. With the current
stateless JWT design, it cannot invalidate a copied token before its expiry.

## Development OTP stub

For local UI work without Twilio, set the following values in the uncommitted
`.env` file:

```env
APP_ENV=development
AUTH_OTP_PROVIDER=stub
AUTH_STUB_WHATSAPP_NUMBER=+628123456789
AUTH_STUB_OTP_CODE=123456
AUTH_COOKIE_SECURE=false
AUTH_FRONTEND_ORIGIN=http://localhost:3000
```

The stub reports all OTP requests as pending, but only approves the exact
configured phone number and code. It refuses to run unless `APP_ENV` is
`development`. It does not send messages or store OTP codes.

Optionally seed the configured phone number with a demo profile:

```bash
uv run python -m scripts.seed_dev_user
```

Never enable `AUTH_OTP_PROVIDER=stub` outside local development.

## Viable MVP options

1. **Twilio Verify SMS** — the recommended public phone-OTP MVP. It fits the
   current FastAPI flow, but costs money after Twilio's trial.
2. **Twilio trial plus this stub** — best for internal and frontend development.
   The stub is free; the Twilio trial provides a small real-device check.
3. **Email OTP** — viable for a zero-budget public MVP only if the product can
   use email identity instead of phone identity. It requires a separate auth
   flow and an email-delivery provider for production.

Supabase Auth is not a free phone-delivery provider: its phone login still
requires an SMS provider.

## Planned PR 4: authorization guard

PR 4 will add a reusable authentication dependency/guard in `app/core/auth.py`.
It will centralize extracting the access cookie, validating the JWT through
`AuthService`, and returning the active `User` to selected routes. The guard
will be opt-in per router or endpoint, so public endpoints remain public.

Initial scope:

- move the duplicated route-local current-user dependency into `app/core/auth.py`;
- provide `require_current_user` for protected routes and a consistent `401`;
- keep `/api/auth/otp/request`, `/api/auth/otp/verify`, `/health`, and all
  existing animal endpoints public;
- document which future routes opt into authentication.

It will not add RBAC, change animal endpoint access, or add token revocation.
