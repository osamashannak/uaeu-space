package utils

import (
	"encoding/json"
	"log"
)

type Question struct {
	ID       string            `json:"id"`
	Required bool              `json:"required"`
	Text     string            `json:"text"`
	Type     string            `json:"type"`
	Options  []string          `json:"options,omitempty"`
	Next     map[string]string `json:"next,omitempty"`
}

var QuestionsJSON = []byte(`[
  {
    "id": "student",
    "required": true,
    "text": "Are you a UAEU student?",
    "type": "radio",
    "options": ["Yes", "No"],
    "next": {
      "Yes": "year",
      "No": "finished",
      "default": "finished"
    }
  },
  {
    "id": "year",
    "required": true,
    "text": "What year are you at?",
    "type": "radio",
    "options": ["1", "2", "3", "4+", "Masters", "PhD", "Non-UAEU student"],
    "next": {
      "1": "helped",
      "2": "helped",
      "3": "helped",
      "4+": "helped",
      "Masters": "finished",
      "PhD": "finished",
      "Non-UAEU student": "finished",
      "default": "finished"
    }
  },
  {
    "id": "helped",
    "required": true,
    "text": "Did SpaceRead help you with picking a professor?",
    "type": "radio",
    "options": ["Yes", "No", "Somewhat"],
    "next": {
      "default": "easyToUse"
    }
  },
  {
    "id": "easyToUse",
    "required": true,
    "text": "How easy was it to use SpaceRead?",
    "type": "radio",
    "options": ["Very easy", "Easy", "Neutral", "Hard", "Very hard"],
    "next": {
      "default": "visitFrequency"
    }
  },
  {
    "id": "visitFrequency",
    "required": true,
    "text": "How often do you visit SpaceRead?",
    "type": "multi",
    "options": ["During registration periods", "Casual visits", "During semesters to rate professors", "When checking professor reviews before registering", "Just exploring the site"],
    "next": {
      "default": "howDidYouHear"
    }
  },
  {
    "id": "howDidYouHear",
    "required": true,
    "text": "How did you learn about SpaceRead?",
    "type": "multi",
    "options": ["Instagram", "Telegram groups", "WhatsApp groups", "Word of mouth (friends)", "Google search", "Other"],
    "next": {
      "default": "recommend"
    }
  },
  {
    "id": "recommend",
    "required": true,
    "text": "Would you recommend SpaceRead to other UAEU students?",
    "type": "radio",
    "options": ["Yes", "No"],
    "next": {
      "default": "coursePriority"
    }
  },
  {
    "id": "coursePriority",
    "required": true,
    "text": "Which one of the following do you prioritize the most when picking a course with a professor?",
    "type": "radio",
    "options": ["Fits my schedule", "Based on online reviews", "Friends’ suggestions", "Previous experience with the professor", "Other"],
    "next": {
      "default": "problems"
    }
  },
  {
    "id": "problems",
    "required": true,
    "text": "Did you face any problems or bugs while using SpaceRead?",
    "type": "radio",
    "options": ["Yes", "No"],
    "next": {
      "default": "offensiveReviews"
    }
  },
  {
    "id": "offensiveReviews",
    "required": true,
    "text": "Have you come across inappropriate or offensive reviews?",
    "type": "radio",
    "options": ["Yes", "No"],
    "next": {
      "default": "trustReviews"
    }
  },
  {
    "id": "trustReviews",
    "required": true,
    "text": "Do you trust the reviews on SpaceRead when choosing a professor?",
    "type": "radio",
    "options": ["Yes, completely", "Mostly", "Neutral", "Not really", "Not at all"],
    "next": {
      "default": "layoutUsability"
    }
  },
  {
    "id": "layoutUsability",
    "required": true,
    "text": "Do you think the website layout and design are user-friendly?",
    "type": "radio",
    "options": ["Very user-friendly", "User-friendly", "Neutral", "Not user-friendly"],
    "next": {
      "default": "wishFeature"
    }
  },
  {
    "id": "wishFeature",
    "required": false,
    "text": "Which feature do you wish was added?",
    "type": "text",
    "next": {
      "default": "notification"
    }
  },
  {
    "id": "notification",
    "required": true,
    "text": "Would you use a feature that notifies you when a section becomes available?",
    "type": "radio",
    "options": ["Yes", "No", "Maybe"],
    "next": {
      "default": "finished"
    }
  },
  {
    "id": "finished",
    "text": "Thank you for your feedback!",
    "type": "text",
    "next": {
      "default": null
    }
  }
]
`)

func IsValidAnswer(question *Question, answer string) bool {
	if question.Type == "radio" || question.Type == "scale" {
		for _, option := range question.Options {
			if option == answer {
				return true
			}
		}
		return false
	} else if question.Type == "multi" {
		var answers []string
		if err := json.Unmarshal([]byte(answer), &answers); err != nil {
			return false
		}
		if len(answers) == 0 {
			return false
		}
		for _, ans := range answers {
			found := false
			for _, option := range question.Options {
				if option == ans {
					found = true
					break
				}
			}
			if !found {
				return false
			}
		}
		return true
	} else if question.Type == "text" {
		return true // Any text is valid
	}
	return false
}

func GetFirstQuestion() *Question {
	return QuestionsMap["student"]
}

func GetNextQuestion(currentID, answer string) (*Question, int) {
	question := QuestionsMap[currentID]
	if question == nil {
		return nil, 0
	}

	nextID := question.Next[answer]
	if nextID == "" {
		nextID = question.Next["default"]
	}

	remaining := GetRemainingQuestionsCount(nextID)

	return QuestionsMap[nextID], remaining
}

var (
	QuestionsMap   map[string]*Question
	QuestionsOrder []string
)

func init() {
	var qs []Question
	if err := json.Unmarshal(QuestionsJSON, &qs); err != nil {
		log.Fatalf("failed to load questions: %v", err)
	}

	QuestionsMap = make(map[string]*Question)
	QuestionsOrder = make([]string, len(qs))

	for i := range qs {
		QuestionsMap[qs[i].ID] = &qs[i]
		QuestionsOrder[i] = qs[i].ID
	}
	log.Printf("Loaded %d survey questions", len(QuestionsMap))
}

func GetRemainingQuestionsCount(currentID string) int {
	remaining := 0
	found := false
	for _, id := range QuestionsOrder {
		if found {
			remaining++
		}
		if id == currentID {
			found = true
		}
	}
	return remaining
}
