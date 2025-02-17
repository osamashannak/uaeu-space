package subnetchecker

import (
	"net"
)

var ipv4Subnets = []string{
	"178.250.248.0/21",
	"178.250.248.0/22",
	"178.250.248.0/23",
	"178.250.250.0/23",
	"178.250.252.0/22",
	"178.250.252.0/23",
	"178.250.254.0/23",
	"194.69.1.0/24",
}

var ipv6Subnets = []string{
	"2a02:1718::/32",
}

// parseSubnets converts CIDR strings into net.IPNet objects
func parseSubnets(subnetList []string) ([]*net.IPNet, error) {
	var parsedSubnets []*net.IPNet
	for _, subnet := range subnetList {
		_, ipNet, err := net.ParseCIDR(subnet)
		if err != nil {
			return nil, err
		}
		parsedSubnets = append(parsedSubnets, ipNet)
	}
	return parsedSubnets, nil
}

// CheckIP checks if the given IP is in any of the defined subnets
func CheckIP(ipStr string) (bool, error) {
	ip := net.ParseIP(ipStr)
	if ip == nil {
		return false, nil // Invalid IP address format
	}

	// Parse subnets
	ipv4Nets, err := parseSubnets(ipv4Subnets)
	if err != nil {
		return false, err
	}
	ipv6Nets, err := parseSubnets(ipv6Subnets)
	if err != nil {
		return false, err
	}

	// Check if IP belongs to any IPv4 subnets
	for _, subnet := range ipv4Nets {
		if subnet.Contains(ip) {
			return true, nil
		}
	}

	// Check if IP belongs to any IPv6 subnets
	for _, subnet := range ipv6Nets {
		if subnet.Contains(ip) {
			return true, nil
		}
	}

	return false, nil // Not in any subnets
}
