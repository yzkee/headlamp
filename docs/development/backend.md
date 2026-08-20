---
title: Backend
sidebar_position: 1
---

Headlamp's backend is written in Go. It is in charge of redirecting
client requests to the right clusters and returning any available
plugins for the client to use.

The backend's most essential function is to read the cluster information
from the given configuration and set up proxies to the defined clusters as
well as endpoints to them. This means that instead of having a set of
endpoints related to the functionality available to the client, it simply
redirects the requests to the defined proxies.

## Building and running

The backend (Headlamp's server) can be quickly built using:

```bash
npm run backend:build
```

Once built, it can be run in development mode (insecure / don't use in production) using:

```bash
npm run backend:start
```

## Backend token protection

`HEADLAMP_BACKEND_TOKEN` enables a local trust boundary around protected backend
routes. The desktop app generates a random token for each launch and sends it to
its backend and renderer. Development commands such as `npm run backend:start`
set a predictable token for local use.

When `HEADLAMP_BACKEND_TOKEN` is unset or empty, backend-token enforcement is
disabled. This opt-in behavior preserves standalone development and test setups
that start the backend directly. Do not expose a non-in-cluster server with an
empty token: protected cluster, plugin, Helm, and proxy routes are then available
without this additional credential check.

When the variable is non-empty, clients must send the same value in the
`X-HEADLAMP_BACKEND-TOKEN` header. WebSocket clients use Headlamp's private
backend-token subprotocol instead. In-cluster mode does not use this desktop
token boundary and continues to rely on its configured authentication and
authorization mechanisms.

## Telemetry

Headlamp's backend supports OpenTelemetry for distributed tracing and Prometheus metrics. See the [Telemetry guide](./telemetry.md) for configuration, local setup with Jaeger and Prometheus, and in-cluster deployment.

## Logging configuration

Headlamp’s backend supports configurable log levels to control verbosity.

Log level can be configured using either a flag or an environment variable:

- the log level: `--log-level` or env var `HEADLAMP_CONFIG_LOG_LEVEL`

Supported Values:

- `debug`
- `info` (default)
- `warn`
- `error`

> **Note:** Headlamp uses zerolog defaults.  
> Zerolog’s default log level is `info`, and Headlamp follows this behavior.

### Examples

Run with warning level:

```bash
./headlamp-server --log-level warn
```

## Lint

To lint the backend/ code.

```bash
npm run backend:lint
```

This command can fix some lint issues.

```bash
npm run backend:lint:fix
```

## Format

To format the backend code.

```bash
npm run backend:format
```

## Test

```bash
npm run backend:test
```

Test coverage with a html report in the browser.

```bash
npm run backend:coverage:html
```

To just print a simpler coverage report to the console.

```bash
npm run backend:coverage
```

## Fuzz Testing

Some backend functions include fuzz tests using Go's native fuzzing support. For example, the `SanitizeClusterName` function in `backend/pkg/auth` has a fuzz test.

To run fuzz tests:

```bash
npm run backend:fuzz
```

This will run fuzz tests in the `backend/pkg/auth` package for 30 seconds. The fuzz corpus (interesting test cases discovered during fuzzing) is stored in `testdata/fuzz/` directories and committed to the repository for regression testing.

For more information about Go fuzzing, see the [official Go fuzzing documentation](https://go.dev/security/fuzz/).
