package database

import (
	"context"
)

func (db *DB) GetSessionID(ctx context.Context, token string) (*int64, error) {
	var id int64

	err := db.Pool.QueryRow(ctx,
		`SELECT id FROM auth.session WHERE token = $1`, token).Scan(&id)

	if err != nil {
		return nil, err
	}

	return &id, nil
}

func (db *DB) CreateSession(ctx context.Context, id int64, token, userAgent, ipAddress string) error {
	_, err := db.Pool.Exec(ctx,
		`INSERT INTO auth.session (token, user_agent, ip_address, id) VALUES ($1, $2, $3, $4)`,
		token, userAgent, ipAddress, id)

	return err
}
