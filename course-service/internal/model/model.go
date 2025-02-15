package model

type Course struct {
	Tag   string
	Name  string
	Views int
	Files []CourseFile
}

type CourseFile struct {
	Id        int64
	BlobName  string
	Name      string
	Type      string
	Size      int
	Visible   bool
	Reviewed  bool
	VtReport  *VtReportJson
	CourseTag string
	Downloads int
}

type VtReportJson struct {
	Malicious        int `json:"malicious"`
	Suspicious       int `json:"suspicious"`
	Undetected       int `json:"undetected"`
	Harmless         int `json:"harmless"`
	Timeout          int `json:"timeout"`
	ConfirmedTimeout int `json:"confirmed-timeout"`
	Failure          int `json:"failure"`
	TypeUnsupported  int `json:"type-unsupported"`
}
