#!/usr/bin/env bash
# CLI session for this repo. URIs are addresses; add --json to any command for machine output.
maxoperf plan     --target staging
maxoperf apply    --target staging
maxoperf apply    --target prod --prune safe
maxoperf run      maxoperf://test/checkout-soak --target prod      # applies the dependency closure first (use --no-apply to skip)
maxoperf run      --target staging --tag smoke
maxoperf describe maxoperf://virtual-service/payments --target staging
maxoperf pull     --target prod --out .maxoperf                    # URIs, adopt map; keys only where they differ from the path-derived key; the common workspace/project goes to targets.yml defaults
maxoperf get tests --target staging --json
