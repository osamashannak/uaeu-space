package utils

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"

	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
)

func GetValidExtension(mimeType string) (string, bool) {
	switch mimeType {
	case "image/jpeg":
		return ".jpeg", true
	case "image/png":
		return ".png", true
	case "image/gif":
		return ".gif", true
	default:
		return "", false
	}
}

type ImageBounds struct {
	Width  int
	Height int
}

func GetImageBounds(fileBytes []byte) (*ImageBounds, error) {
	decodedImage, _, err := image.Decode(bytes.NewReader(fileBytes))
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %w", err)
	}

	bounds := decodedImage.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	return &ImageBounds{
		Width:  width,
		Height: height,
	}, nil
}

func ProcessImageFile(fileBytes []byte) (processedBytes []byte, newContentType string, err error) {
	decodedImage, _, err := image.Decode(bytes.NewReader(fileBytes))

	if err != nil {
		return nil, "", fmt.Errorf("failed to decode image: %w", err)
	}

	var buffer bytes.Buffer

	err = jpeg.Encode(&buffer, decodedImage, &jpeg.Options{Quality: 85})

	if err != nil {
		return nil, "", fmt.Errorf("failed to encode image: %w", err)
	}

	return buffer.Bytes(), "image/jpeg", nil

}
