# Project Rules

## Releases

- Releases are append-only. Never overwrite, delete, or refresh an existing release folder.
- Every new release must use a new versioned or dated folder under `releases/`.
- Each release must remain standalone, including its own launcher/server file and all runtime assets or dependencies it needs.
- Before creating a release, verify that the destination folder does not already exist. If it does, choose a new release folder instead.
