# Full-stack example repo

A self-contained repo layout: a secret, a config value, a dataset, a virtual service deployed first, three tests (two
single, one Vario) bound to them by `maxoperf://` URIs, and an alert rule, promoted staging -> prod with
`.maxoperf/targets.yml`. Copy the whole folder to the root of a repo.

```text
.maxoperf/
  targets.yml
  secrets/checkout-api-token.yml    configs/target-url.yml    datasets/users.yml
  virtual-services/payments.yml
  tests/checkout-soak.yml   tests/search-api.yml   tests/mixed-load.yml (vario)
  alert-rules/checkout-p95.yml
perf/checkout-soak/script.js   perf/checkout-soak/data/users.csv   perf/search-api/script.js
data/users.csv
```

- Paths in files (`entrypoint`, `assets`, `file`) are repo-root-relative.
- Keys are explicit here. `pull` and `export` write `key:` only when it differs from the key derived from the path
  (`.maxoperf/tests/search-api.yml` -> `search-api`).
- The `${var.target_url}` token in `configs/target-url.yml` is filled from the selected target's `vars`.
- `maxoperf://private-datacenter/name:eu-k8s` and the Slack integration are addressed by name: they already exist in
  the destination account.
- `checkout-soak` binds a virtual service (`deploy: true`, so apply deploys it before the tests that use it), a dataset, a
  secret and a config value, and `euxProbeTestId` makes `search-api` apply first.

| File | What it is |
| --- | --- |
| [`cli-session.sh`](cli-session.sh) | The CLI commands for this repo: plan, apply, prune, run, describe, pull |
| [`plan-output.txt`](plan-output.txt) | What `plan --target staging` prints, with the dependency tiers |
| [`plan-line.json`](plan-line.json) | One `plan --json` line (`schemaVersion` on the document) |
| [`completion.txt`](completion.txt) | Editor completion of references after `maxoperf schema sync` |
| [`../workflows/full-stack-promote.yml`](../workflows/full-stack-promote.yml) | GitHub Actions matrix: apply to staging and prod |
