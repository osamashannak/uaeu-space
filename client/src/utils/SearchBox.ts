export interface ProfDataList {
    name: string,
    email: string
}

export interface CourseDataList {
    tag: string,
    name: string
}

export type DatalistContent = CourseDataList | ProfDataList;

export interface CourseSearchBoxProps {
    type: "course",
    datalist: CourseDataList[],
}

export interface ProfSearchBoxProps {
    type: "professor",
    datalist: ProfDataList[],
}

export type SearchBoxProps = ProfSearchBoxProps | CourseSearchBoxProps;

export const getCourseFilter = (inputValue: string) => {
    return (courses: CourseDataList) => {
        return (
            !inputValue ||
            courses.tag.toLowerCase().includes(inputValue.toLowerCase()) ||
            courses.name.toLowerCase().includes(inputValue.toLowerCase())
        )
    }
}

export const getProfFilter = (inputValue: string) => {
    return (professors: ProfDataList) => {
        return (
            !inputValue ||
            professors.name.toLowerCase().includes(inputValue.toLowerCase())
        )
    }
}