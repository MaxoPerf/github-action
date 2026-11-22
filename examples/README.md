# MaxoPerf Load Test: examples

Copy-paste workflows and test files for [`MaxoPerf/github-action@v1`](../README.md). Full guide:
<https://maxoperf.com/docs/integrations/github-actions/>

## Prerequisites

1. A MaxoPerf account and API key. Store the key as the repository secret `MAXOPERF_API_KEY`.
2. Your account id and (optionally) default project id as repository variables `MAXOPERF_ACCOUNT_ID` and
   `MAXOPERF_PROJECT_ID`. A test file can set its own `projectId` instead.
3. Test files in `.maxoperf/tests/*.yml` (see [`tests/`](tests)), committed with their scripts and assets. `entrypoint`
   and `assets` paths are relative to the repository root; the examples here use `examples/tests/...`, so adjust them
   to wherever you copy the files.
4. Any config values or secrets a test binds (`config:`, `secrets:`) must already exist in the MaxoPerf workspace.

Not on GitHub? Deploy hooks give other CD systems the same run-after-deploy trigger without this action.

## Choose your scenario

- Gate pull requests: [`pr-gate.yml`](workflows/pr-gate.yml); roll out gently with [`report-only.yml`](workflows/report-only.yml).
- Keep MaxoPerf in sync with git: [`push-on-merge.yml`](workflows/push-on-merge.yml).
- Test a freshly deployed environment: [`after-deploy.yml`](workflows/after-deploy.yml) or [`vercel-dispatch.yml`](workflows/vercel-dispatch.yml).
- Scheduled or on-demand runs: [`nightly-soak.yml`](workflows/nightly-soak.yml), [`manual-dispatch.yml`](workflows/manual-dispatch.yml).
- Many repos, one setup: [`reusable-workflow.yml`](workflows/reusable-workflow.yml).

## Workflows

| Scenario | File | What it shows | Trigger |
| --- | --- | --- | --- |
| PR gate | [`pr-gate.yml`](workflows/pr-gate.yml) | Fail the job on failed criteria; sticky PR comment | `pull_request` |
| Push on merge | [`push-on-merge.yml`](workflows/push-on-merge.yml) | `command: push`, sync only, path-filtered | `push` to main |
| After deploy | [`after-deploy.yml`](workflows/after-deploy.yml) | Success-only; `TARGET_URL` from the deployment | `deployment_status` |
| Vercel / dispatch | [`vercel-dispatch.yml`](workflows/vercel-dispatch.yml) | `TARGET_URL` from `client_payload.url` | `repository_dispatch` |
| Nightly soak | [`nightly-soak.yml`](workflows/nightly-soak.yml) | Cron plus manual start; longer timeout | `schedule`, `workflow_dispatch` |
| Manual run | [`manual-dispatch.yml`](workflows/manual-dispatch.yml) | Target URL and test glob as inputs | `workflow_dispatch` |
| Report only | [`report-only.yml`](workflows/report-only.yml) | `fail-on: never`, never blocks | `pull_request` |
| Fire and forget | [`fire-and-forget.yml`](workflows/fire-and-forget.yml) | `wait: false`, returns immediately | `push` to main |
| Single test / subset | [`single-and-subset.yml`](workflows/single-and-subset.yml) | One path, or multiline `tests` globs | `workflow_dispatch` |
| Environment matrix | [`matrix-environments.yml`](workflows/matrix-environments.yml) | Push once, then run per environment | `workflow_dispatch` |
| Monorepo | [`monorepo-paths.yml`](workflows/monorepo-paths.yml) | Run only when tests or the service change | `pull_request` + `paths` |
| Use outputs | [`outputs-summary-slack.yml`](workflows/outputs-summary-slack.yml) | `passed`, `report-url`, `results` in a summary and Slack | `workflow_dispatch` |
| Reusable workflow | [`reusable-workflow.yml`](workflows/reusable-workflow.yml) | Shared setup with secrets passed in | `workflow_call` |
| Reusable caller | [`reusable-caller.yml`](workflows/reusable-caller.yml) | Calls the reusable workflow | `workflow_dispatch` |
| Multiple overrides | [`multiple-overrides.yml`](workflows/multiple-overrides.yml) | Several `KEY=VALUE` config overrides | `workflow_dispatch` |
| Custom timeout | [`custom-timeout.yml`](workflows/custom-timeout.yml) | `timeout-minutes` for long runs | `workflow_dispatch` |
| Custom API origin | [`custom-api-base.yml`](workflows/custom-api-base.yml) | `api-base` override | `workflow_dispatch` |

## Test files

Test file v1 (`.maxoperf/tests/*.yml`). Each has its script or asset under [`tests/scripts/`](tests/scripts).

| File | Shows |
| --- | --- |
| [`k6-smoke.yml`](tests/k6-smoke.yml) | k6 smoke test; `TARGET_URL` bound from config |
| [`jmeter-api.yml`](tests/jmeter-api.yml) | JMeter `.jmx` as the entrypoint |
| [`k6-criteria.yml`](tests/k6-criteria.yml) | Failure criteria: p95 latency and error rate % |
| [`k6-config-secrets.yml`](tests/k6-config-secrets.yml) | `config:` and `secrets:` bindings |
| [`k6-csv-data.yml`](tests/k6-csv-data.yml) | A CSV asset uploaded with the test |

Protocol engines need at least 25 virtual users per runner, so the examples set `maxVirtualUsersPerRunner: 25`.
Never commit tokens; use `secrets:` bindings and `${{ secrets.MAXOPERF_API_KEY }}`.
