package utils

import (
	"net"
	"net/http"
	"strings"
)

func GetClientIP(r *http.Request) string {
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		ips := strings.Split(xff, ",")
		for _, ip := range ips {
			ip = strings.TrimSpace(ip)
			parsed := net.ParseIP(ip)
			if parsed != nil {
				if parsed.To4() != nil { // IPv4
					return ip
				}
			}
		}
		return strings.TrimSpace(ips[0])
	}

	fwd := r.Header.Get("Forwarded")
	if fwd != "" {
		parts := strings.Split(fwd, ";")
		for _, p := range parts {
			if strings.HasPrefix(strings.ToLower(p), "for=") {
				ip := strings.Trim(p[4:], `"`)
				parsed := net.ParseIP(ip)
				if parsed != nil {
					if parsed.To4() != nil {
						return ip
					}
				}
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
