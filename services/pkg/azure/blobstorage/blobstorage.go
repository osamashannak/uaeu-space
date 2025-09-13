package blobstorage

import (
	"context"
	"fmt"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/sas"
	"github.com/osamashannak/uaeu-space/services/pkg/utils"
	"net"
	"net/url"
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

func (s *BlobStorage) GenerateSASToken(ipAddress net.IP, expiresOn time.Time) (string, error) {
	permissions := sas.BlobPermissions{
		Read: true,
	}

	sasValues := sas.BlobSignatureValues{
		ContainerName: s.containerName,
		Permissions:   permissions.String(),
		ExpiryTime:    expiresOn,
		Protocol:      sas.ProtocolHTTPS,
		IPRange: sas.IPRange{
			Start: ipAddress,
			End:   ipAddress,
		},
	}

	queryParams, err := sasValues.SignWithSharedKey(s.credential)

	if err != nil {
		return "", err
	}

	q := url.Values{}
	q.Set("sv", queryParams.Version())
	q.Set("se", queryParams.ExpiryTime().Format(time.RFC3339))
	q.Set("sip", fmt.Sprintf("%s-%s", queryParams.IPRange().Start, queryParams.IPRange().End))
	q.Set("sr", string(queryParams.Resource()))
	q.Set("sp", string(queryParams.Permissions()))
	q.Set("sig", queryParams.Signature())

	return q.Encode(), nil
}

func (s *BlobStorage) FormatSASURL(blobName, queryParams string) string {
	return utils.FormatBlobURL(s.accountClient.URL(), s.containerName, blobName, queryParams)
}
