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
