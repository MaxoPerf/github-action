# MaxoPerf Load Test

**Keep load and performance tests in git.** This action syncs `.maxoperf/tests/*.yml` to
[MaxoPerf](https://maxoperf.com), runs them on CI or after a deploy, and gates the job on the verdict.
Results appear in the job summary and, optionally, as one sticky pull request comment.

Full guide: <https://maxoperf.com/docs/integrations/github-actions/>

## Quick start

Commit a test file, `.maxoperf/tests/checkout.yml`:

```yaml
name: "Checkout soak"          # stable identity: the sync key
projectId: "prj-0123456789"
engineKind: "taurus"
entrypoint: "perf/checkout.yml" # path relative to the repo root
criteria:
  - { subject: "p95", condition: ">", threshold: 800, unit: "ms" }
```

Add a workflow:

```yaml
name: perf
on: pull_request
permissions:
  contents: read
  pull-requests: write # only needed for pr-comment
jobs:
  load-test:
    if: github.event.pull_request.head.repo.fork != true
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: MaxoPerf/github-action@v1
        with:
          api-key: ${{ secrets.MAXOPERF_API_KEY }}
          account-id: ${{ vars.MAXOPERF_ACCOUNT_ID }}
          pr-comment: true
```

## After a deploy

```yaml
on: deployment_status
jobs:
  load-test:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: MaxoPerf/github-action@v1
        with:
          api-key: ${{ secrets.MAXOPERF_API_KEY }}
          account-id: ${{ vars.MAXOPERF_ACCOUNT_ID }}
          config-overrides: TARGET_URL=${{ github.event.deployment_status.environment_url }}
```

Vercel and other hosts that send a `repository_dispatch` use `TARGET_URL=${{ github.event.client_payload.url }}`.

## Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `api-key` | yes | | MaxoPerf API key (`mpak_...`); pass it via secrets |
| `account-id` | yes | | MaxoPerf account id |
| `project-id` | no | | Default project for test files without `projectId` |
| `command` | no | `run` | `run` (sync, then run) or `push` (sync only) |
| `tests` | no | `.maxoperf/tests/*.{yml,yaml}` | Newline-separated globs; one path runs one test |
| `config-overrides` | no | | Per-run config values, one `KEY=VALUE` per line |
| `wait` | no | `true` | Wait for runs to finish |
| `fail-on` | no | `criteria` | `criteria` fails the job on a failed run; `never` never does |
| `timeout-minutes` | no | `60` | Max minutes to wait per run |
| `pr-comment` | no | `false` | Post or update one sticky PR comment |
| `github-token` | no | `${{ github.token }}` | Token for the PR comment |
| `api-base` | no | `https://app.maxoperf.com` | MaxoPerf API origin |

## Outputs

| Output | Description |
| --- | --- |
| `results` | JSON array: name, testId, runId, status, passed, reportUrl |
| `test-id`, `run-id`, `status`, `report-url` | Values of the first test |
| `passed` | `true` when every run passed |

## Security notes

- Store the API key as a secret. The action masks it in logs.
- Override values are stored on the run and returned by the API; the console shows only their keys. Do not pass
  tokens as overrides; use workspace secrets.
- Secrets are unavailable on pull requests from forks. Guard the job with
  `if: github.event.pull_request.head.repo.fork != true`, otherwise `api-key` is empty and the step fails.
- The PR comment runs on `pull_request` events only, not `pull_request_target`. Without
  `pull-requests: write` it logs a warning and the job continues.

## Support

<https://maxoperf.com/support>. License: MIT.
