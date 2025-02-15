package database

import (
	"net/url"
	"strconv"
	"time"
)

type Config struct {
	Name               string        `env:"DB_NAME"`
	User               string        `env:"DB_USER" json:",omitempty"`
	Host               string        `env:"DB_HOST, default=localhost" json:",omitempty"`
	Port               string        `env:"DB_PORT, default=5432" json:",omitempty"`
	SSLMode            string        `env:"DB_SSLMODE, default=require" json:",omitempty"`
	ConnectionTimeout  int           `env:"DB_CONNECT_TIMEOUT" json:",omitempty"`
	Password           string        `env:"DB_PASSWORD" json:"-"` // ignored by zap's JSON formatter
	SSLCertPath        string        `env:"DB_SSLCERT" json:",omitempty"`
	SSLKeyPath         string        `env:"DB_SSLKEY" json:",omitempty"`
	SSLRootCertPath    string        `env:"DB_SSLROOTCERT" json:",omitempty"`
	PoolMinConnections string        `env:"DB_POOL_MIN_CONNS" json:",omitempty"`
	PoolMaxConnections string        `env:"DB_POOL_MAX_CONNS" json:",omitempty"`
	PoolMaxConnLife    time.Duration `env:"DB_POOL_MAX_CONN_LIFETIME, default=5m" json:",omitempty"`
	PoolMaxConnIdle    time.Duration `env:"DB_POOL_MAX_CONN_IDLE_TIME, default=1m" json:",omitempty"`
	PoolHealthCheck    time.Duration `env:"DB_POOL_HEALTH_CHECK_PERIOD, default=1m" json:",omitempty"`
}

func (c *Config) DatabaseConfig() *Config {
	return c
}

func (c *Config) ConnectionURL() string {
	if c == nil {
		return ""
	}

	host := c.Host
	if v := c.Port; v != "" {
		host = host + ":" + v
	}

	u := &url.URL{
		Scheme: "postgres",
		Host:   host,
		Path:   c.Name,
	}

	if c.User != "" || c.Password != "" {
		u.User = url.UserPassword(c.User, c.Password)
	}

	q := u.Query()
	if v := c.ConnectionTimeout; v > 0 {
		q.Add("connect_timeout", strconv.Itoa(v))
	}
	if v := c.SSLMode; v != "" {
		q.Add("sslmode", v)
	}
	if v := c.SSLCertPath; v != "" {
		q.Add("sslcert", v)
	}
	if v := c.SSLKeyPath; v != "" {
		q.Add("sslkey", v)
	}
	if v := c.SSLRootCertPath; v != "" {
		q.Add("sslrootcert", v)
	}
	u.RawQuery = q.Encode()

	return u.String()
}
