package stirling.software.common.service;

import java.util.Map;

import org.springframework.stereotype.Service;

/**
 * Local no-op analytics service for the commercial fork.
 *
 * <p>The upstream MIT baseline exposed analytics hooks through this service. In this fork the
 * service intentionally performs no network requests. Keeping the API avoids coupling unrelated
 * PDF operations to an external analytics provider.
 */
@Service
public class PostHogService {

    public void captureEvent(String eventName, Map<String, Object> properties) {
        // Intentionally disabled.
    }

    public Map<String, Object> captureServerMetrics() {
        return Map.of();
    }

    public Map<String, Object> captureApplicationProperties() {
        return Map.of();
    }
}
