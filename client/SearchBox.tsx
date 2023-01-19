import {useCombobox} from "downshift";
import {useState} from "react";

const CourseSearchBox = () => {
    const books = [
        {author: 'Harper Lee', title: 'To Kill a Mockingbird'},
        {author: 'Lev Tolstoy', title: 'War and Peace'},
        {author: 'Fyodor Dostoyevsy', title: 'The Idiot'},
        {author: 'Oscar Wilde', title: 'A Picture of Dorian Gray'},
        {author: 'George Orwell', title: '1984'},
        {author: 'Jane Austen', title: 'Pride and Prejudice'},
        {author: 'Marcus Aurelius', title: 'Meditations'},
        {author: 'Fyodor Dostoevsky', title: 'The Brothers Karamazov'},
        {author: 'Lev Tolstoy', title: 'Anna Karenina'},
        {author: 'Fyodor Dostoevsky', title: 'Crime and Punishment'},
    ]

    const getBooksFilter = (inputValue: string) => {
        return (book: { title: string; author: string; }) => {
            return (
                !inputValue ||
                book.title.toLowerCase().includes(inputValue) ||
                book.author.toLowerCase().includes(inputValue)
            )
        }
    }

    const SearchBox = () => {
        const [items, setItems] = useState(books)

        const {
            isOpen,
            getToggleButtonProps,
            getLabelProps,
            getMenuProps,
            getInputProps,
            highlightedIndex,
            getItemProps,
            selectedItem,
        } = useCombobox({
            onInputValueChange({inputValue}) {
                setItems(books.filter(getBooksFilter(inputValue)))
            },
            items,
            itemToString(item) {
                return item ? item.title : ''
            },
        })

        return (
            <div>

                <div className="w-72 flex flex-col gap-1">

                    <label className="w-fit" {...getLabelProps()}>
                        Choose your favorite book:
                    </label>

                    <div className="flex shadow-sm bg-white gap-0.5">
                        <input
                            placeholder="Best book ever"
                            className="w-full p-1.5"
                            {...getInputProps()}
                        />
                        <button
                            aria-label="toggle menu"
                            className="px-2"
                            type="button"
                            {...getToggleButtonProps()}
                        >
                            {isOpen ? <>&#8593;</> : <>&#8595;</>}
                        </button>
                    </div>

                </div>

                <ul
                    {...getMenuProps()}
                >
                    {isOpen &&
                        items.map((item, index) => (
                            <li
                                className={cx(
                                    highlightedIndex === index && 'bg-blue-300',
                                    selectedItem === item && 'font-bold',
                                    'py-2 px-3 shadow-sm flex flex-col',
                                )}
                                key={`${item.value}${index}`}
                                {...getItemProps({item, index})}
                            >
                                <span>{item.title}</span>
                                <span className="text-sm text-gray-700">{item.author}</span>
                            </li>
                        ))}
                </ul>
            </div>
        )

    }

    return SearchBox;
}

export default SearchBox;