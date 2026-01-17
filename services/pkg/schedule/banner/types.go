package banner

type responseWrapper struct {
	TotalCount int          `json:"totalCount"`
	Data       []rawSection `json:"data"`
}

type rawSection struct {
	CRN            string       `json:"courseReferenceNumber"`
	Subject        string       `json:"subject"`
	CourseNumber   string       `json:"courseNumber"`
	Title          string       `json:"courseTitle"`
	SeatsAvailable int          `json:"seatsAvailable"`
	Faculty        []rawFaculty `json:"faculty"`
	Meetings       []rawMeeting `json:"meetingsFaculty"`
}

type rawFaculty struct {
	Email       string `json:"emailAddress"`
	DisplayName string `json:"displayName"`
}

type rawMeeting struct {
	MeetingTime struct {
		BeginTime   string `json:"beginTime"`
		EndTime     string `json:"endTime"`
		Building    string `json:"building"`
		Room        string `json:"room"`
		MeetingType string `json:"meetingType"` // "CLAS" or "FINL"

		// Boolean days
		Monday    bool `json:"monday"`
		Tuesday   bool `json:"tuesday"`
		Wednesday bool `json:"wednesday"`
		Thursday  bool `json:"thursday"`
		Friday    bool `json:"friday"`
		Saturday  bool `json:"saturday"`
		Sunday    bool `json:"sunday"`
	} `json:"meetingTime"`
}
