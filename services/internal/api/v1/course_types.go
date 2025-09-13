package v1

type CourseInList struct {
	Tag  string `json:"tag"`
	Name string `json:"name"`
}

type CourseFind struct {
	Tag string `json:"tag"`
}

type CourseFindResponse struct {
	Tag   string `json:"tag"`
	Name  string `json:"name"`
	Files []File `json:"files"`
}

type UploadFile struct {
	Tag      string `json:"tag"`
	FileName string `json:"file_name"`
	Contents []byte `json:"contents"`
}

type File struct {
	ID            int64  `json:"id,string"`
	Name          string `json:"name"`
	Type          string `json:"type"`
	Size          int    `json:"size"`
	DownloadCount int    `json:"download_count"`
	CreatedAt     string `json:"created_at"`
}
