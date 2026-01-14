#!/bin/bash

set -e

export PATH=$PATH:$(go env GOPATH)/bin

# Run load test for foo (1000 requests, 10 concurrent)
hey -n 1000 -c 10 -host foo.localhost http://127.0.0.1/ > foo-results.txt 2>&1 || true

# Run load test for bar (1000 requests, 10 concurrent)
hey -n 1000 -c 10 -host bar.localhost http://127.0.0.1/ > bar-results.txt 2>&1 || true

# Extract key stats using grep/awk (hey output is structured)
extract_stats() {
  file=$1
  req_per_sec=$(grep "Requests/sec" $file | awk '{print $2}')
  avg_duration=$(grep "Response time histogram" -A 3 $file | grep mean | awk '{print $3 "ms"}')
  p90_duration=$(grep "90%" $file | awk '{print $2 "ms"}')
  p95_duration=$(grep "95%" $file | awk '{print $2 "ms"}')
  failures=$(grep "Non-2xx" $file | awk '{print $5}' | sed 's/%//')
  echo "Requests/sec: $req_per_sec  
Avg response time: $avg_duration  
P90 response time: $p90_duration  
P95 response time: $p95_duration  
Failure rate: ${failures:-0}%"
}

foo_stats=$(extract_stats foo-results.txt)
bar_stats=$(extract_stats bar-results.txt)

# Generate markdown report
cat << EOF > load-test-results.md
## Load Test Results

### Foo (foo.localhost)
$foo_stats

### Bar (bar.localhost)
$bar_stats

Full raw output available in workflow logs.
EOF