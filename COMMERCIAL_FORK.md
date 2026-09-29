# Commercial fork baseline

This branch is the commercial-safe baseline for this fork.

## Source baseline

It starts from upstream commit:

`3d312c2fd1312ab8f6c863cd6af0f23828e58c80`

This commit predates the May 2025 split that moved code into separately licensed proprietary modules. At this baseline, the repository root `LICENSE` is the MIT License.

The original MIT copyright and permission notice must remain with copies or substantial portions of the software.

## Why this branch exists

Newer Stirling-PDF versions contain directories governed by the Stirling PDF User License rather than MIT. Do not copy code from those newer restricted directories into this branch unless its license is separately reviewed and permits our intended commercial deployment.

Examples of restricted directories in newer upstream versions include:

- `app/proprietary/`
- `app/saas/`
- `engine/`
- `frontend/editor/src/proprietary/`
- `frontend/editor/src/desktop/`
- `frontend/editor/src/saas/`
- `frontend/editor/src/cloud/`
- `frontend/editor/src/prototypes/`
- `frontend/editor/src/portal/`
- `frontend/editor/src/portal-saas/`

## Commercial product policy

- Keep the upstream MIT notice in `LICENSE`.
- Use our own product name, logo, domain, UI copy, and visual identity.
- Review third-party dependency licenses before production release.
- Prefer independently implemented or separately permissively licensed replacements for features introduced later under restricted upstream directories.
- Do not pull restricted upstream source code merely to restore a missing newer feature.

## Render

The root `render.yaml` uses `Dockerfile.fat` so Render can build the Java application inside Docker. It configures Spring Boot to listen on Render's default web-service port and enables Arabic + English OCR language data.

This document is a technical provenance record, not legal advice.
