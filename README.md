# SapiGo Backend

Backend for SapiGo, built with FastAPI for API routing and PyTorch for the muzzle biometric verification model.

## How to Run

Build the image. This also pulls the trained embedding model weights from Hugging Face automatically, no manual download needed:

```bash
docker build -t sapigo-backend .
```

Model weights are pulled from [SapiGo/Muzzle-Biometric-Embedding](https://huggingface.co/SapiGo/Muzzle-Biometric-Embedding/tree/main) on Hugging Face during the build.

Run the container:

```bash
docker run --rm -p 8000:8000 sapigo-backend
```

The API will be available at `http://localhost:8000`.
Docs (OpenAPI) at `http://localhost:8000/docs`.

## Tech Stack

- FastAPI for API routing
- PyTorch for AI inference (muzzle embedding model)

## Muzzle Biometrics Flow

Step by step call sequence to enroll an animal and later verify it.

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

Returns `animal_id` (UUID). Save it, every following call needs it.

### 2. Upload 2 to 3 reference photos (different angles)

```
POST /media-assets/upload
```

Multipart form:

| field | value |
|---|---|
| `file` | image binary |
| `animal_id` | from step 1 |
| `media_type` | `MUZZLE_PHOTO` |
| `uploaded_by_user_id` | optional for now |

Each photo passes the quality gate (blur or exposure check) before it is stored.

422 means the photo was rejected. Retake it and check `reasons` in the response.
201 means the photo was accepted. The response includes `id`, which is the `media_asset_id`.

Repeat 2 to 3 times with genuinely different angles and lighting. Collect all returned `media_asset_id` values.

### 3. Enroll (build the muzzle template)

```
POST /animals/{animal_id}/enroll
```
```json
{
  "media_asset_ids": ["<id-1>", "<id-2>", "<id-3>"]
}
```

Fetches each photo, embeds it, then averages and re-normalizes into one template vector.

400 means fewer than the minimum required images were provided.
201 means success, returning `MuzzleTemplateRead` (template_id, reference_image_count, etc). The raw vector is never exposed.

Re-enrolling the same `animal_id` overwrites its existing template.

### 4. Verify: check a live photo against the claimed identity

```
POST /animals/{animal_id}/verify
```

Multipart form:

| field | value |
|---|---|
| `file` | image binary (the live or query photo) |
| `verified_by_user_id` | optional for now |

Internally, the photo is uploaded and quality gated (tagged `VERIFICATION_PHOTO`), embedded, then compared against that animal's stored template using cosine similarity. The attempt is logged.

422 means the photo was rejected by the quality gate.
400 means the animal has no enrolled template yet. Do step 3 first.
201 means success, returning `VerificationRead`:

- `similarity_score`: cosine similarity, ranges from 0 to 1
- `decision`: `MATCH` or `NO_MATCH` (threshold currently 0.62, from `final_threshold_at_far_1pct`)

### Flow summary

```
POST /animals                           -> animal_id
POST /media-assets/upload  (x2 to 3)    -> media_asset_ids
POST /animals/{id}/enroll               -> muzzle_template
POST /animals/{id}/verify  (repeatable) -> verification result
```