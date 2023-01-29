export interface ProfData {
    name: string,
    email: string
}

export interface CourseData {
    tag: string,
    name: string
}

export type DatalistContent = CourseData | ProfData;

export interface CourseSearchBoxProps {
    type: "course",
}

export interface ProfSearchBoxProps {
    type: "professor",
}

export type SearchBoxProps = ProfSearchBoxProps | CourseSearchBoxProps;

export const getFilter = (inputValue: string, type: "professor" | "course") => {
    return (courses: any) => {
        return (
            !inputValue ||
            courses.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            (type === "course" ? courses.tag.toLowerCase().includes(inputValue.toLowerCase()) : false)
        )
    }
}