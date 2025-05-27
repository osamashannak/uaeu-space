package cache

import (
	"sync"
	"time"
)

type Entry[T any] struct {
	Data      T
	ExpiresAt time.Time
}

type Cache[T any] struct {
	data map[string]Entry[T]
	mu   sync.RWMutex
	ttl  time.Duration
}

func New[T any](ttl time.Duration) *Cache[T] {
	return &Cache[T]{
		data: make(map[string]Entry[T]),
		ttl:  ttl,
	}
}

func (c *Cache[T]) Get(key string) (T, bool) {
	var zero T

	c.mu.RLock()
	entry, found := c.data[key]
	c.mu.RUnlock()

	if !found || time.Now().After(entry.ExpiresAt) {
		return zero, false
	}

	return entry.Data, true
}

func (c *Cache[T]) Set(key string, data T) {
	c.mu.Lock()
	c.data[key] = Entry[T]{
		Data:      data,
		ExpiresAt: time.Now().Add(c.ttl),
	}
	c.mu.Unlock()
}

func (c *Cache[T]) Delete(key string) {
	c.mu.Lock()
	delete(c.data, key)
	c.mu.Unlock()
}

func (c *Cache[T]) Clear() {
	c.mu.Lock()
	c.data = make(map[string]Entry[T])
	c.mu.Unlock()
}
