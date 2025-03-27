package telemetry

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestResponseWriter tests the custom response writer implementation
func TestResponseWriter(t *testing.T) {
	recorder := httptest.NewRecorder()

	writer := newResponseWriter(recorder)

	assert.Equal(t, http.StatusOK, writer.statusCode)

	// Write a header with a different status
	writer.WriteHeader(http.StatusNotFound)

	// Status should be updated
	assert.Equal(t, http.StatusNotFound, writer.statusCode)

	// The underlying ResponseWriter should also receive the status
	assert.Equal(t, http.StatusNotFound, recorder.Code)

	// Write some content
	content := "Test Content"
	_, err := writer.Write([]byte(content))
	require.NoError(t, err)

	// Content should be written to the underlying ResponseWriter
	assert.Equal(t, content, recorder.Body.String())
}
