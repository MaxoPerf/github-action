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
- Run existing console tests by tag or id: [`run-by-tag.yml`](workflows/run-by-tag.yml).
- Scheduled or on-demand runs: [`nightly-soak.yml`](workflows/nightly-soak.yml), [`manual-dispatch.yml`](workflows/manual-dispatch.yml).
- Many repos, one setup: [`reusable-workflow.yml`](workflows/reusable-workflow.yml).

- Plan on a pull request, apply on merge (with prune), detect drift: [`plan-on-pr.yml`](workflows/plan-on-pr.yml),
  [`apply-on-merge-prune.yml`](workflows/apply-on-merge-prune.yml), [`drift-check.yml`](workflows/drift-check.yml).
- Staging then prod from one set of files: [`matrix-targets.yml`](workflows/matrix-targets.yml), [`targets.yml`](targets.yml).
- Everything at once (secret, config, dataset, virtual service, tests, alert): the [`full-stack/`](full-stack/README.md) repo.

## Workflows

| Scenario | File | What it shows | Trigger |
| --- | --- | --- | --- |
| Plan on PR | [`plan-on-pr.yml`](workflows/plan-on-pr.yml) | `command: plan` with a sticky PR comment; writes nothing | `pull_request` |
| Apply on merge, prune | [`apply-on-merge-prune.yml`](workflows/apply-on-merge-prune.yml) | `command: apply` the whole repo to a `target:`, `prune: safe` (needs the full repo) | `push` to main |
| Drift check | [`drift-check.yml`](workflows/drift-check.yml) | `plan` with `exit-code: true` fails (exit 4) on pending changes | `schedule` |
| Trigger by tag | [`trigger-by-tag.yml`](workflows/trigger-by-tag.yml) | Runs every console test with a tag given as an input | `workflow_dispatch` |
| Trigger by test id | [`trigger-by-test-id.yml`](workflows/trigger-by-test-id.yml) | `test-ids` as `maxoperf://test/...` URIs or ids | `workflow_dispatch` |
| Nightly by tag | [`nightly-by-tag.yml`](workflows/nightly-by-tag.yml) | Runs every test tagged `nightly` | `schedule` |
| Bootstrap pull | [`bootstrap-pull.yml`](workflows/bootstrap-pull.yml) | `command: export` prints a resource file from an existing account | `workflow_dispatch` |
| Secrets from GitHub | [`secrets-from-github.yml`](workflows/secrets-from-github.yml) | A `valueFrom: {env}` secret fed from a GitHub secret | `push` to main |
| Multi-environment | [`multi-environment-apply.yml`](workflows/multi-environment-apply.yml) | Staging job, then prod behind an approval | `push` to main |
| Matrix of targets | [`matrix-targets.yml`](workflows/matrix-targets.yml) | One job per target, same files promoted | `push` to main |
| Apply one target | [`apply-target.yml`](workflows/apply-target.yml) | Chosen target plus a per-run `vars` override | `workflow_dispatch` |
| Adopt existing | [`adopt-existing.yml`](workflows/adopt-existing.yml) | First apply against an account with resources; `no-adopt` | `workflow_dispatch` |
| Drift per target | [`plan-drift-per-target.yml`](workflows/plan-drift-per-target.yml) | Drift check matrix over targets | `schedule` |
| Full-stack promote | [`full-stack-promote.yml`](workflows/full-stack-promote.yml) | Apply the [`full-stack/`](full-stack/README.md) repo to every target | `push` to main |
| v1.0.0 workflow | [`old-v1-workflow.yml`](workflows/old-v1-workflow.yml) | A workflow written for v1.0.0, unchanged (`tests`, `config-overrides`) | `pull_request` |
| PR gate | [`pr-gate.yml`](workflows/pr-gate.yml) | Fail the job on failed criteria; sticky PR comment | `pull_request` |
| Push on merge | [`push-on-merge.yml`](workflows/push-on-merge.yml) | `command: push`, sync only, path-filtered | `push` to main |
| After deploy | [`after-deploy.yml`](workflows/after-deploy.yml) | Success-only; `TARGET_URL` from the deployment | `deployment_status` |
| Vercel / dispatch | [`vercel-dispatch.yml`](workflows/vercel-dispatch.yml) | `TARGET_URL` from `client_payload.url` | `repository_dispatch` |
| Nightly soak | [`nightly-soak.yml`](workflows/nightly-soak.yml) | Cron plus manual start; longer timeout | `schedule`, `workflow_dispatch` |
| Manual run | [`manual-dispatch.yml`](workflows/manual-dispatch.yml) | Target URL and test glob as inputs | `workflow_dispatch` |
| Report only | [`report-only.yml`](workflows/report-only.yml) | `fail-on: never`, never blocks | `pull_request` |
| Run by tag | [`run-by-tag.yml`](workflows/run-by-tag.yml) | Runs every console test tagged `smoke`, no repo files | `workflow_dispatch` |
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

Test kinds and scenarios (each declares an explicit `key:`; the first line is the schema modeline for editor completion).
`pull` and `export` omit `key:` when it equals the key derived from the path and write it only when it differs.

| File | Shows |
| --- | --- |
| [`perf-k6.yml`](tests/perf-k6.yml) | Performance test: k6 script plus CSV asset, criteria |
| [`perf-jmeter-taurus-criteria.yml`](tests/perf-jmeter-taurus-criteria.yml) | JMeter through a Taurus file with `passfail` criteria (object and short form) |
| [`direct-locust.yml`](tests/direct-locust.yml) | Direct Locust run |
| [`direct-jmeter-criteria.yml`](tests/direct-jmeter-criteria.yml) | Direct JMeter run with failure criteria |
| [`functional-api.yml`](tests/functional-api.yml) | Functional API check; `loadProfile` is still required (the functional minimum) |
| [`browser-playwright.yml`](tests/browser-playwright.yml) | Browser test, Playwright |
| [`browser-selenium.yml`](tests/browser-selenium.yml) | Browser test, Selenium, several browsers |
| [`builder-http.yml`](tests/builder-http.yml) | Builder test: HTTP request model kept in git |
| [`builder-browser.yml`](tests/builder-browser.yml) | Builder test: browser steps kept in git |
| [`vario-perf-mix.yml`](tests/vario-perf-mix.yml) | Vario master mixing tests (`members` as URIs) |
| [`vario-perf-eux.yml`](tests/vario-perf-eux.yml) | Vario master with an end-user-experience probe |
| [`test-with-attachments.yml`](tests/test-with-attachments.yml) | Schedules, notification rules, dependencies, data bindings, virtual services, EUX probe |
| [`test-secrets-config.yml`](tests/test-secrets-config.yml) | Config and secret bindings by URI, with an aliased env name |

## Resource kinds

One copy-paste file per kind. Copy to `.maxoperf/<plural-kind>/<slug>.yml` (the header comment of each file names the
directory) and adjust the repo-root-relative `file:` / `entrypoint` paths. Files reference each other by
`maxoperf://<kind>/<key>`, `.../name:<name>` or `.../id:<id>`. Fleets declared in git are recreated on apply after their TTL.

| Kind | File |
| --- | --- |
| workspace | [`workspace.yml`](resources/workspace.yml) |
| project | [`project.yml`](resources/project.yml) |
| config | [`config.yml`](resources/config.yml) |
| secret | [`secret.yml`](resources/secret.yml) |
| dataset | [`dataset.yml`](resources/dataset.yml) |
| data-entity | [`data-entity.yml`](resources/data-entity.yml) |
| transform-snippet | [`transform-snippet.yml`](resources/transform-snippet.yml) |
| test | [`test.yml`](resources/test.yml) |
| virtual-service | [`virtual-service.yml`](resources/virtual-service.yml) |
| virtual-service-pack | [`virtual-service-pack.yml`](resources/virtual-service-pack.yml) |
| dashboard | [`dashboard.yml`](resources/dashboard.yml) |
| alert-rule | [`alert-rule.yml`](resources/alert-rule.yml) |
| alert-maintenance-window | [`alert-maintenance-window.yml`](resources/alert-maintenance-window.yml) |
| notification-integration | [`notification-integration.yml`](resources/notification-integration.yml) |
| notification-rule | [`notification-rule.yml`](resources/notification-rule.yml) |
| deploy-hook | [`deploy-hook.yml`](resources/deploy-hook.yml) |
| apm-integration | [`apm-integration.yml`](resources/apm-integration.yml) |
| git-connection | [`git-connection.yml`](resources/git-connection.yml) |
| private-datacenter | [`private-datacenter.yml`](resources/private-datacenter.yml) |
| browser-fleet | [`browser-fleet.yml`](resources/browser-fleet.yml) |
| account-settings | [`account-settings.yml`](resources/account-settings.yml) |

## Targets, editor and the full-stack repo

| File | Shows |
| --- | --- |
| [`targets.yml`](targets.yml) | `.maxoperf/targets.yml`: staging and prod with per-target `vars` (`${var.target_url}`) and an `adopt` map |
| [`editor/.vscode/settings.json`](editor/.vscode/settings.json) | `yaml.schemas` mapping for VS Code and compatible editors (or run `maxoperf schema sync`) |
| [`full-stack/README.md`](full-stack/README.md) | A whole repo: secret, config, dataset, virtual service, tests, alert, plan output and CLI session |

Protocol engines need at least 25 virtual users per runner, so the examples set `maxVirtualUsersPerRunner: 25`.
Never commit tokens; use `secrets:` bindings and `${{ secrets.MAXOPERF_API_KEY }}`.
