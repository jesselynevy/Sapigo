# Backend 

SapiGo backend built with FastAPI for API Routing and Verification with Pytorch for AI Integration

Tech-stack :
FastAPI 
Pytorch

## Setup

Install [uv](https://docs.astral.sh/uv/):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Install dependencies:

```bash
uv sync
```

## Run

```bash
uv run dev
```

The API will be available at `http://127.0.0.1:8000`.

For docs this is using openapi at `http://127.0.0.1:8000/docs`.

## Muzzle Biometrics Flow

Step-by-step call sequence to enroll an animal and later verify it.

### 1. Create the animal

```
POST /animals
```
```json
{
  "display_name": "Bessie",
  "breed": "Brahman",
  "sex": "F"
}
```
-> returns `animal_id` (UUID). Save it, every following call needs it.

### 2. Upload 2–3 reference photos (different angles)

```
POST /media-assets/upload
```
Multipart form:
| field | value |
|---|---|
| `file` | image binary |
| `animal_id` | from step 1 |
| `media_type` | `MUZZLE_PHOTO` |
| `uploaded_by_user_id` | *(optional for now)* |

- Each photo passes the quality gate (blur/exposure) before it's stored.
- **422** = rejected, retake photo — check `reasons` in the response.
- **201** = accepted, response includes `id` (this is a `media_asset_id`).

Repeat 2–3 times with genuinely different angles/lighting. Collect all returned `media_asset_id`s.

### 3. Enroll — build the muzzle template

```
POST /animals/{animal_id}/enroll
```
```json
{
  "media_asset_ids": ["<id-1>", "<id-2>", "<id-3>"]
}
```
- Fetches each photo, embeds it, averages + re-normalizes into one template vector.
- **400** = fewer than the minimum required images.
- **201** = returns `MuzzleTemplateRead` (template_id, reference_image_count, etc. no raw vector exposed).

Re-enrolling the same `animal_id` **overwrites** its existing template.

### 4. Verify — check a live photo against the claimed identity

```
POST /animals/{animal_id}/verify
```
Multipart form:
| field | value |
|---|---|
| `file` | image binary (the live/query photo) |
| `verified_by_user_id` | *(optional for now)* |

- Internally: uploads + quality-gates the photo (tagged `VERIFICATION_PHOTO`), embeds it, compares against that animal's stored template (cosine similarity), logs the attempt.
- **422** = photo rejected by quality gate.
- **400** = animal has no enrolled template yet (do step 3 first).
- **201** = returns `VerificationRead`:
  - `similarity_score` — cosine similarity, 0–1
  - `decision` — `MATCH` or `NO_MATCH` (threshold currently `0.7852`, from `final_threshold_at_far_1pct`)

### Flow summary

```
POST /animals                          -> animal_id
POST /media-assets/upload  (×2–3)      -> media_asset_ids
POST /animals/{id}/enroll              -> muzzle_template
POST /animals/{id}/verify  (repeatable)->verification result
```