package v1

type ErrorResponse struct {
	Error   int    `json:"error"`
	Message string `json:"message"`
}
