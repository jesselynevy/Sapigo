# SapiGo MVP Proposal: Biometric Verification Before Cow-Out

## Executive summary

SapiGo is a mobile-web MVP for a single, high-risk operational moment in cattle inventory management: confirming that the cow selected for release from a reseller's inventory is the cow whose muzzle is presented at the point of transfer. The system records a cow, enrols a muzzle template from three reference photos, and requires a new muzzle photo to be verified before the system records **cow-out** (`transferred_at`).

This is deliberately a decision-support tool, not a legal proof of ownership, an official government traceability system, a health diagnosis, or a guarantee that every handover is error-free. Its immediate value is to add an auditable identity check before a reseller releases a high-value physical animal.

## Problem and rationale

Livestock identification and traceability matter because an animal's identity must remain connected to its records and movements. The World Organisation for Animal Health (WOAH) identifies animal identification and traceability as tools that support animal health, food safety, movement control, inspection, certification, and fair trade; it also stresses that traceability programmes need clear scope, performance criteria, stakeholder roles, and record exchange [1][2].

In day-to-day cattle operations, a written record or a visible identifier identifies the *expected record*, but an operator still needs to decide whether the physical animal in front of them corresponds to it. SapiGo addresses this narrower operational gap at cow-out. It does not replace ear tags, invoices, official records, or human inspection. It adds a biometric comparison immediately before a transfer is recorded.

Muzzle images are a credible area for an MVP investigation. In one peer-reviewed study, deep-learning models identified 268 feedlot cattle from 4,923 muzzle images, with a best closed-set accuracy of 98.7% under that study's data and conditions [3]. A separate study used 9,230 images from 336 Hanwoo cattle and reported a best test accuracy of 97.0% [4]. These results establish feasibility, not an accuracy claim for SapiGo: breeds, camera distance, lighting, image quality, model design, and evaluation protocol materially affect real-world performance. SapiGo must measure performance on locally collected, identity-disjoint data before making any performance promise.

Indonesia is an appropriate setting for a livestock-inventory and movement-support MVP. BPS's *Peternakan Dalam Angka 2025* is the official annual source for livestock population, beef/buffalo production and consumption, supply-demand, trade, and related statistics [5]. This proposal relies on that primary source for national context, rather than inferring transaction volumes or making unverified claims about the number of intermediaries.

## Current MVP workflow

The following describes the workflow implemented in the current frontend and backend.

1. **Reseller registers a cow.** The signed-in reseller creates an animal record with owner ID, name, and optional breed, sex, and weight. The new record belongs to that reseller.
2. **Reseller enrols the biometric reference.** The reseller captures three reference images—middle, left, and right muzzle views. Each image is quality-checked and stored; the set is used to create or replace the cow's muzzle template.
3. **Optional inventory verification.** A reseller can select one of their own active cows, review its stored details, capture a current muzzle photo, and run a verification. This writes a verification record with a similarity score, model version, image asset, timestamp, and decision.
4. **Transfer preparation.** The reseller selects an active cow and enters a recipient phone number. In the current MVP, the phone number is input validation only; it is not persisted as a recipient or transaction record.
5. **AI-gated cow-out.** The reseller captures a current muzzle photo. The backend quality-checks and stores the photo, compares its embedding with the enrolled template, and logs the verification. Only a `verified` decision marks the animal as transferred by recording `transferred_at`. Any non-verified result leaves the cow-out unrecorded.
6. **Outcome.** The app displays either confirmed cow-out with a timestamp or an unsuccessful verification result. The system retains the verification evidence used for that outcome.

## Scope boundaries and honest product language

| Current capability | Product wording | Not currently implemented |
| --- | --- | --- |
| Owner-scoped animal inventory | “A reseller manages cows registered under their account.” | Authenticated role enforcement beyond the current client-supplied owner ID |
| Three-photo muzzle enrolment | “Create a biometric reference from guided muzzle photos.” | A claim that three images guarantee an accurate template |
| Similarity comparison and audit log | “Compare a live muzzle image with the registered cow's template and record the result.” | A legal identity or ownership determination |
| Quality rejection | “Reject unusable images and ask the operator to retake them.” | Automatic health assessment |
| Transfer gate | “Record cow-out only when the current verification is verified.” | Recipient ownership transfer, delivery confirmation, or a full transaction record |
| Verification decisions | “Verified” and “not verified”; poor images are rejected before inference. | A separately produced `manual_review` outcome—the enum exists, but the current inference service only produces `verified` or `mismatch` |
| Cow selection from inventory | “Select the cow from the reseller's inventory.” | QR/ear-tag scanning or QR-generated verification links |

The distinction is important: the earlier QR-led, multi-party handover narrative is a reasonable future direction, but it would misrepresent the current MVP. The present proposal should therefore avoid saying that users scan QR ear tags, that a buyer verifies a delivery, that WhatsApp sharing occurs, or that SapiGo persists a complete chain-of-custody record.

## MVP objectives and success criteria

### Objectives

1. Enable a reseller to create a cow record and enrol a usable muzzle template.
2. Require an image-quality check and biometric verification before recording cow-out.
3. Preserve enough evidence to audit a verification attempt: animal, template, live image asset, score, decision, model version, and timestamp.
4. Provide operators with a clear outcome and a safe fallback: retake a rejected image or keep the animal in inventory when it is not verified.

### Measurable pilot criteria

These are proposed evaluation criteria, not current results.

| Dimension | Proposed measurement |
| --- | --- |
| Enrolment completion | Share of newly created cows that obtain a valid template from the guided three-photo flow |
| Image usability | Rejection rate and rejection reason by reference versus live photo |
| Operational reliability | Share of transfer attempts for which the backend returns and stores a result |
| Biometric safety | False-accept rate, false-reject rate, and manual-review rate on an identity-disjoint, locally collected evaluation set |
| User operation | Median time from selecting a cow to a recorded or blocked cow-out |
| Audit completeness | Share of verification records with required evidence fields populated |

Thresholds must be selected after a pilot and according to the cost of mistakes. A false accept (wrong cow marked cow-out) and a false reject (right cow blocked) have different operational consequences; reporting only “accuracy” would be insufficient.

## Safeguards and evaluation plan

- Use identity-disjoint train, validation, and test splits so images of the same animal never appear in both training and test data.
- Evaluate across relevant breeds, sites, lighting, camera devices, and muzzle conditions. The published literature itself notes the sensitivity of visual identification to capture conditions and generalisation [3][4].
- Keep the quality gate before inference and return actionable retake guidance.
- Retain a human exception process. Until a `manual_review` decision and its operations are implemented, an unsuccessful result must simply prevent automated cow-out and be escalated outside the app according to the operator's procedure.
- Version the model and retain decision evidence so pilot outcomes can be reviewed and thresholds revised.
- Apply access control and data-minimisation before a field pilot. The current owner ID is supplied in API input and is explicitly a temporary arrangement; it should be replaced with authenticated server-side identity and authorization.

## Future phases (not MVP claims)

The MVP can become a broader handover-verification product only after these capabilities are designed and implemented:

1. QR or ear-tag scan to retrieve an expected record, with tamper-resistant tag issuance and a public/recipient-safe verification view.
2. Recipient, transfer, custody, delivery, and acceptance records—rather than only `transferred_at`.
3. A genuine `manual_review` policy, interface, reviewer role, and resolution record.
4. Shareable verification receipts and any WhatsApp integration, with consent and privacy controls.
5. Role-based access for farmers, resellers, drivers, and buyers, plus server-side authorization.
6. Integration with official traceability requirements only in consultation with the relevant veterinary authority and applicable Indonesian rules. WOAH treats formal animal-identification systems as programmes requiring clear governance and roles [1][2].

## Conclusion

SapiGo's defensible MVP proposition is simple: **before a reseller records cow-out, SapiGo uses a guided live muzzle check against that cow's enrolled template and records the result.** It is a focused operational control that complements, rather than replaces, existing livestock identifiers and records. The next proof point is not a national-scale claim; it is a carefully evaluated local pilot that demonstrates image usability, biometric error rates, operational speed, and whether users can act safely on the result.

## References

1. World Organisation for Animal Health. (2022). *Terrestrial Animal Health Code, Chapter 4.2: General principles on identification and traceability of live animals.* https://www.woah.org/fileadmin/Home/eng/Health_standards/tahc/current/chapitre_ident_traceability.pdf
2. World Organisation for Animal Health. (2024). *Chapter 4.3: Design and implementation of identification systems to achieve animal traceability.* https://www.woah.org/fileadmin/Home/eng/Health_standards/tahc/2024/en_chapitre_ident_design.htm
3. Li, G., Erickson, G. E., & Xiong, Y. (2022). Individual beef cattle identification using muzzle images and deep learning techniques. *Animals, 12*(11), 1453. https://doi.org/10.3390/ani12111453
4. Lee, T., Na, Y., Kim, B. G., Lee, S., & Choi, Y. (2023). Identification of individual Hanwoo cattle by muzzle pattern images through deep learning. *Animals, 13*(18), 2856. https://doi.org/10.3390/ani13182856
5. Badan Pusat Statistik. (2026). *Peternakan Dalam Angka 2025.* https://www.bps.go.id/id/publication/2026/01/09/50771bc6f5761886458558ba/peternakan-dalam-angka-2025.html
