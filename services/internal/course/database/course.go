package database

import (
	"context"
	v1 "github.com/osamashannak/uaeu-space/services/internal/api/v1"
	"github.com/osamashannak/uaeu-space/services/internal/course/model"
)

func (db *CourseDB) GetCourses(ctx context.Context) ([]v1.CourseInList, error) {
	var courses = make([]v1.CourseInList, 0)

	rows, err := db.Db.Pool.Query(ctx, `SELECT name, tag FROM course.course ORDER BY views DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var (
			name string
			tag  string
		)

		err := rows.Scan(&name, &tag)
		if err != nil {
			return nil, err
		}

		courses = append(courses, v1.CourseInList{
			Name: name,
			Tag:  tag,
		})
	}

	return courses, nil
}

func (db *CourseDB) GetCourse(ctx context.Context, tag string) (*model.Course, error) {
	var course model.Course

	err := db.Db.Pool.QueryRow(ctx, `SELECT tag, name, views FROM course.course WHERE tag = $1`, tag).Scan(&course.Tag, &course.Name, &course.Views)

	if err != nil {
		return nil, err
	}

	rows, err := db.Db.Pool.Query(ctx, `SELECT id, blob_name, name, type, size, downloads FROM course.course_file WHERE course_tag = $1 AND visible = true`, tag)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	err = db.incrementCourseViews(ctx, tag)

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

func (db *CourseDB) incrementCourseViews(ctx context.Context, tag string) error {
	_, err := db.Db.Pool.Exec(ctx, `UPDATE course.course SET views = views + 1 WHERE tag = $1`, tag)

	return err
}

func (db *CourseDB) GetCourseFileBlobName(ctx context.Context, id int64) (*string, error) {
	var blobName string

	err := db.Db.Pool.QueryRow(ctx, `SELECT blob_name FROM course.course_file WHERE id = $1`, id).Scan(&blobName)

	if err != nil {
		return nil, err
	}

	return &blobName, nil
}

func (db *CourseDB) InsertCourseFile(ctx context.Context, file model.CourseFile) error {
	_, err := db.Db.Pool.Exec(ctx, `INSERT INTO course.course_file (blob_name, name, type, size, visible, reviewed, vt_report, course_tag, downloads) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, file.BlobName, file.Name, file.Type, file.Size, file.Visible, file.Reviewed, file.VtReport, file.CourseTag, file.Downloads)

	return err
}
