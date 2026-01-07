package models

import "time"

// Section represents a specific instance of a course (e.g., CRN 21615)
type Section struct {
	CRN            string    `json:"crn"`
	Subject        string    `json:"subject"`
	CourseNumber   string    `json:"course_number"`
	Title          string    `json:"title"`
	SeatsAvailable int       `json:"seats_available"`
	Faculty        []Faculty `json:"faculty"`
	Meetings       []Meeting `json:"meetings"`
}

type Faculty struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

type Meeting struct {
	Type      string         `json:"type"`
	StartTime string         `json:"start_time"` // "1200"
	EndTime   string         `json:"end_time"`   // "1350"
	Building  string         `json:"building"`
	Room      string         `json:"room"`
	Days      []time.Weekday `json:"days"`
}
