# load-test-ci
# CI Load Testing with Kubernetes

This repository implements a CI/CD pipeline for load testing multi-node Kubernetes deployments using GitHub Actions and KinD.

## Features

- **Automated CI Pipeline**: Triggered on every pull request
- **Multi-node Kubernetes Cluster**: Provisioned using KinD with 3 nodes (1 control-plane, 2 workers)
- **NGINX Ingress Controller**: For routing traffic
- **Dual Service Deployment**: Deploys both "foo" and "bar" http-echo services
- **Comprehensive Load Testing**: Custom Go-based load tester with detailed metrics
- **Automated Reporting**: Results posted as comments on GitHub PRs
- **Health Verification**: Ensures all components are healthy before testing

## Architecture



## Metrics Collected

- Request duration (avg, p50, p90, p95, p99)
- Success/failure rates
- Requests per second
- HTTP status code distribution
- Error counts

## Usage

1. Create a pull request to the main branch
2. The CI workflow automatically triggers
3. Check the GitHub Actions tab for progress
4. Results are posted as a comment on the PR

## Local Development

```bash
chmod +x scripts/*.sh
./scripts/setup-kind.sh
./scripts/deploy-apps.sh
./scripts/load-test.sh

kind delete cluster --name load-test-cluster