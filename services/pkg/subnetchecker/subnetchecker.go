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

func CheckIP(ipStr string) bool {
	ip := net.ParseIP(ipStr)
	if ip == nil {
		return false
	}

	ipv4Nets, err := parseSubnets(ipv4Subnets)
	if err != nil {
		return false
	}
	ipv6Nets, err := parseSubnets(ipv6Subnets)
	if err != nil {
		return false
	}

	for _, subnet := range ipv4Nets {
		if subnet.Contains(ip) {
			return true
		}
	}

	for _, subnet := range ipv6Nets {
		if subnet.Contains(ip) {
			return true
		}
	}

	return false
}
