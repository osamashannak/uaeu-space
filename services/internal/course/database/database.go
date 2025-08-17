package database

import (
	"context"
	"github.com/osamashannak/uaeu-space/services/internal/course/model"
	"github.com/osamashannak/uaeu-space/services/pkg/database"
)

type CourseDB struct {
	Db *database.DB
}

func New(db *database.DB) *CourseDB {
	return &CourseDB{db: db}
}

func (c *CourseDB) GetCourseList(ctx context.Context) ([]model.Course, error) {
	courses := make([]model.Course, 0)

	rows, err := c.db.Pool.Query(ctx, `SELECT tag, name FROM course.course ORDER BY views DESC`)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var course model.Course
		err = rows.Scan(&course.Tag, &course.Name)
		if err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}

	return courses, nil
}

func (c *CourseDB) GetCourse(ctx context.Context, tag string) (*model.Course, error) {
	var course model.Course

	err := c.db.Pool.QueryRow(ctx, `SELECT tag, name, views FROM course.course WHERE tag = $1`, tag).Scan(&course.Tag, &course.Name, &course.Views)

	if err != nil {
		return nil, err
	}

	rows, err := c.db.Pool.Query(ctx, `SELECT id, blob_name, name, type, size, downloads FROM course.course_file WHERE course_tag = $1 AND visible = true`, tag)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	err = c.incrementCourseViews(ctx, tag)

	for rows.Next() {
		var file model.CourseFile
		err = rows.Scan(&file.Id, &file.BlobName, &file.Name, &file.Type, &file.Size, &file.Visible, &file.Reviewed, &file.VtReport, &file.CourseTag, &file.Downloads)
		if err != nil {
			return nil, err
		}
		course.Files = append(course.Files, file)
	}

	return &course, nil
}

func (c *CourseDB) incrementCourseViews(ctx context.Context, tag string) error {
	_, err := c.db.Pool.Exec(ctx, `UPDATE course.course SET views = views + 1 WHERE tag = $1`, tag)

	return err
}

func (c *CourseDB) GetCourseFileBlobName(ctx context.Context, id int64) (*string, error) {
	var blobName string

	err := c.db.Pool.QueryRow(ctx, `SELECT blob_name FROM course.course_file WHERE id = $1`, id).Scan(&blobName)

	if err != nil {
		return nil, err
	}

	err = c.incrementFileDownloads(ctx, blobName)

	if err != nil {
		return nil, err
	}

	return &blobName, nil
}

func (c *CourseDB) InsertCourseFile(ctx context.Context, file model.CourseFile) error {
	_, err := c.db.Pool.Exec(ctx, `INSERT INTO course.course_file (blob_name, name, type, size, visible, reviewed, vt_report, course_tag, downloads) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, file.BlobName, file.Name, file.Type, file.Size, file.Visible, file.Reviewed, file.VtReport, file.CourseTag, file.Downloads)

	return err
}

func (c *CourseDB) incrementFileDownloads(ctx context.Context, tag string) error {
	_, err := c.db.Pool.Exec(ctx, `UPDATE course.course_file SET download = downloads + 1 WHERE tag = $1`, tag)

	return err
}
