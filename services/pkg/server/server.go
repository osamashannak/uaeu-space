package server

import (
	"context"
	"errors"
	"fmt"
	"github.com/osamashannak/uaeu-space/services/pkg/logging"
	"google.golang.org/grpc"
	"net"
	"net/http"
	"strconv"
	"time"
)

type Server struct {
	ip       string
	port     string
	listener net.Listener
}

func New(port string) (*Server, error) {
	addr := fmt.Sprintf(":" + port)
	listener, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, fmt.Errorf("failed to create listener on %s: %w", addr, err)
	}

	return &Server{
		ip:       listener.Addr().(*net.TCPAddr).IP.String(),
		port:     strconv.Itoa(listener.Addr().(*net.TCPAddr).Port),
		listener: listener,
	}, nil
}

func (s *Server) ServeHTTP(ctx context.Context, handler http.Handler) error {
	logger := logging.FromContext(ctx)

	srv := &http.Server{
		Addr:    s.listener.Addr().String(),
		Handler: handler,
	}

	errCh := make(chan error, 1)
	go func() {
		<-ctx.Done()

		logger.Debugf("server.Serve: context closed")
		shutdownCtx, done := context.WithTimeout(context.Background(), 5*time.Second)
		defer done()

		logger.Debugf("server.Serve: shutting down")
		errCh <- srv.Shutdown(shutdownCtx)
	}()

	// Run the server. This will block until the provided context is closed.
	if err := srv.Serve(s.listener); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return fmt.Errorf("failed to serve: %w", err)
	}

	logger.Debugf("server.Serve: serving stopped")

	// Return any errors that happened during shutdown.
	if err := <-errCh; err != nil {
		return fmt.Errorf("failed to shutdown server: %w", err)
	}
	return nil
}

func (s *Server) ServeGRPC(ctx context.Context, srv *grpc.Server) error {
	logger := logging.FromContext(ctx)

	errCh := make(chan error, 1)
	go func() {
		<-ctx.Done()

		logger.Debugf("server.Serve: context closed")
		logger.Debugf("server.Serve: shutting down")
		srv.GracefulStop()
	}()

	// Run the server. This will block until the provided context is closed.
	if err := srv.Serve(s.listener); err != nil && !errors.Is(err, grpc.ErrServerStopped) {
		return fmt.Errorf("failed to serve: %w", err)
	}

	logger.Debugf("server.Serve: serving stopped")

	// Return any errors that happened during shutdown.
	select {
	case err := <-errCh:
		return fmt.Errorf("failed to shutdown: %w", err)
	default:
		return nil
	}
}
