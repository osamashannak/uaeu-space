package utils

import (
	"net"
	"net/http"
	"strings"
)

func GetClientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		ips := strings.Split(xff, ",")
		return strings.TrimSpace(ips[0])
	}

	if fwd := r.Header.Get("Forwarded"); fwd != "" {
		// parse: for="IP"
		parts := strings.Split(fwd, ";")
		for _, p := range parts {
			if strings.HasPrefix(strings.ToLower(p), "for=") {
				ip := strings.Trim(p[4:], `"`) // remove for= and quotes
				return ip
			}
		}
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
