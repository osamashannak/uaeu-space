package blobstorage

import (
	"context"
	"fmt"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/sas"
	"net"
	"os"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

type BlobStorage struct {
	accountClient *azblob.Client
	credential    *azblob.SharedKeyCredential
	containerName string
}

func newAccessTokenCredential(accountName string, accountKey string) (*azblob.SharedKeyCredential, error) {
	credential, err := azblob.NewSharedKeyCredential(accountName, accountKey)
	if err != nil {
		return nil, fmt.Errorf("azure.newAccessTokenCredential: %w", err)
	}
	return credential, nil
}

func New(containerName string) (*BlobStorage, error) {
	accountName := os.Getenv("AZURE_STORAGE_ACCOUNT")
	if accountName == "" {
		return nil, fmt.Errorf("missing AZURE_STORAGE_ACCOUNT")
	}

	primaryURL := fmt.Sprintf("https://%s.blob.core.windows.net", accountName)

	accountKey := os.Getenv("AZURE_STORAGE_ACCESS_KEY")

	credential, err := newAccessTokenCredential(accountName, accountKey)

	if err != nil {
		return nil, err
	}

	client, err := azblob.NewClientWithSharedKeyCredential(primaryURL, credential, nil)

	if err != nil {
		return nil, fmt.Errorf("azure.NewBlobStorage: %w", err)
	}

	return &BlobStorage{
		accountClient: client,
		credential:    credential,
		containerName: containerName,
	}, nil
}

func (s *BlobStorage) CreateObject(ctx context.Context, name, contentType, cacheControl string, contents []byte) error {
	_, err := s.accountClient.UploadBuffer(
		ctx,
		s.containerName,
		name,
		contents,
		&azblob.UploadBufferOptions{HTTPHeaders: &blob.HTTPHeaders{
			BlobContentType:  &contentType,
			BlobCacheControl: &cacheControl,
		}},
	)

	return err
}

func (s *BlobStorage) generateSASToken(ipAddress net.IP) (string, error) {
	expiry := time.Now().Add(3 * 30 * 24 * time.Hour)

	permissions := sas.BlobPermissions{
		Read: true,
	}

	sasQueryParams, err := sas.BlobSignatureValues{
		ExpiryTime:    expiry,
		Protocol:      sas.ProtocolHTTPS,
		Permissions:   permissions.String(),
		ContainerName: s.containerName,
		IPRange: sas.IPRange{
			Start: ipAddress,
			End:   ipAddress,
		},
	}.SignWithSharedKey(s.credential)

	if err != nil {
		return "", fmt.Errorf("failed to generate SAS token: %w", err)
	}

	return sasQueryParams.Encode(), nil
}
