package telemetry

import (
	"go.opentelemetry.io/otel/metric"
)

// Metrics represents a collection of standardized application metrics.
// It encapsulates various counters, gauges, and histograms for tracking
// application performance and behavior.
type Metrics struct {
	// RequestCounter tracks the total number of HTTP requests
	RequestCounter metric.Int64Counter
	// RequestDuration measures the distribution of HTTP request durations
	RequestDuration metric.Float64Histogram
	// ActiveRequestsGauge tracks the number of currently active HTTP requests
	ActiveRequestsGauge metric.Int64UpDownCounter
	// ClusterProxyRequests counts requests made through the cluster proxy
	ClusterProxyRequests metric.Int64Counter
	// PluginLoadCount tracks the number of plugin loads
	PluginLoadCount metric.Int64Counter
	// ErrorCounter counts application errors by category
	ErrorCounter metric.Int64Counter
}
