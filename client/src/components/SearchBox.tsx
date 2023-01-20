import {useCombobox} from "downshift";
import {useState} from "react";
import {Link} from "react-router-dom";

const CourseSearchBox = () => {
    const courses = [
        {tag: 'Harper Lee', name: 'To Kill a Mockingbird'},
        {tag: 'Lev Tolstoy', name: 'War and Peace'},
        {tag: 'Fyodor Dostoyevsy', name: 'The Idiot'},
        {tag: 'Oscar Wilde', name: 'A Picture of Dorian Gray'},
        {tag: 'George Orwell', name: '1984'},
        {tag: 'Jane Austen', name: 'Pride and Prejudice'},
        {tag: 'Marcus Aurelius', name: 'Meditations'},
        {tag: 'Fyodor Dostoevsky', name: 'The Brothers Karamazov'},
        {tag: 'Lev Tolstoy', name: 'Anna Karenina'},
        {tag: 'Fyodor Dostoevsky', name: 'Crime and Punishment'},
    ]

    const getCourseFilter = (inputValue: string) => {
        return (courses: { tag: string; name: string; }) => {
            return (
                !inputValue ||
                courses.tag.toLowerCase().includes(inputValue) ||
                courses.name.toLowerCase().includes(inputValue)
            )
        }
    }

    const SearchBox = () => {
        const [items, setItems] = useState([] as typeof courses)

        const {
            isOpen,
            getToggleButtonProps,
            getLabelProps,
            getMenuProps,
            getInputProps,
            highlightedIndex,
            getItemProps,
            selectedItem,
            inputValue
        } = useCombobox({
            onInputValueChange({inputValue}) {
                if (!inputValue) {
                    setItems([]);
                    return;
                }
                setItems(courses.filter(getCourseFilter(inputValue!)).slice(0,5));
            },
            items
        })

        return (
            <div>

                <label className={"icon-label"}>
                    <input placeholder={"Search course name"} className={"search-bar"} {...getInputProps()}/>
                </label>

                <ul className={"datalist"} {...getMenuProps()}>
                    {isOpen &&
                        items.map((item, index) => (
                            <li
                                className={"datalist-option"}
                                key={`${item.tag}${index}`}
                                {...getItemProps({item, index})}
                            >
                                <span>{item.tag}</span>
                                <span className={"course-name"}>{item.name}</span>
                            </li>))
                    }
                </ul>

                <p><Link className={"help-course"} to={'/report'}>I can't find my course!</Link></p>

            </div>
        )

    }

    return <SearchBox/>;
}

export default CourseSearchBox;