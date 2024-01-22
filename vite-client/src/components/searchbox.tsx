import {useCombobox} from "downshift";
import {useRef, useState} from "react";
import Fuse from "fuse.js";
import {useNavigate} from "react-router-dom";
import styles from "../styles/components/searchbox.module.scss";
import {Item} from "../typed/searchbox.ts";
import {getCoursesList} from "../api/course.ts";
import {getProfessorsList} from "../api/professor.ts";

export default function SearchBox(props: { type: "professor" | "course" }) {

    const SearchBox = () => {

        const [items, setItems] = useState<Item[]>([]);
        const [allItems, setAllItems] = useState<Item[]>([]);
        const lastInputValue = useRef<string>();
        const navigate = useNavigate();

        const {
            inputValue,
            getMenuProps,
            getInputProps,
            highlightedIndex,
            getItemProps,
        } = useCombobox({
            id: 'search-box',
            async onInputValueChange({inputValue}) {
                lastInputValue.current = inputValue;

                if (!inputValue) {
                    setItems([]);
                    return;
                }

                if (items.length === 1 && items[0].name === "Loading...") {
                    return
                }

                if (!allItems.length) {
                    setItems([{name: "Loading..."}] as Item[]);

                    let datalist: undefined | Item[];

                    if (props.type === "course") {
                        datalist = await getCoursesList();
                    } else {
                        datalist = await getProfessorsList();
                    }

                    if (!datalist) return;

                    let fuse;

                    if ('tag' in datalist[0]) {
                        fuse = new Fuse(datalist, {
                            threshold: 0.4,
                            ignoreLocation: true,
                            keys: ['tag', 'name']
                        })
                    } else {
                        fuse = new Fuse(datalist, {
                            threshold: 0.4,
                            ignoreLocation: true,
                            keys: ['name']
                        })
                    }

                    setAllItems(datalist);

                    setItems(fuse.search(lastInputValue.current as string, {limit: 5}).map((result) => result.item));

                    return;
                }

                let fuse;

                if (props.type === "course") {
                    fuse = new Fuse(allItems, {
                        threshold: 0.4,
                        ignoreLocation: true,
                        keys: ['name', 'tag']
                    })
                } else {
                    fuse = new Fuse(allItems, {
                        threshold: 0.4,
                        ignoreLocation: true,
                        keys: ['name']
                    })
                }

                setItems(fuse.search(lastInputValue.current as string, {limit: 5}).map((result) => result.item));

            },
            items,
            itemToString(item) {
                return item ? item.name : "";
            },
            onSelectedItemChange: ({selectedItem: newSelectedItem}) => {
                if (!newSelectedItem) return;
                if ('email' in newSelectedItem) {
                    navigate(`/professor/${newSelectedItem.email}`);
                } else {
                    navigate(`/course/${newSelectedItem.tag}`);

                }
            }
        })

        return (
            <div className={styles.searchBox}>
                <input placeholder={props.type === "course" ? "Search for a course..." : "Search for a professor..."}
                    className={styles.searchBar} {...getInputProps()}/>
                <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="m18.9 20.3l-5.6-5.6q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.625 5.625q.275.275.275.675t-.3.7q-.275.275-.7.275t-.7-.275ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"/>
                </svg>


                <div className={styles.parentDataList}>
                    <ul className={styles.datalist} {...getMenuProps()}>
                        {inputValue &&
                            items.map((element, index) => (
                                <li className={`${styles.datalistOption} ${highlightedIndex === index && ` ${styles.bgBlueOption}`}`}
                                    style={element.name === "Loading..." ? {pointerEvents: "none"} : {}}
                                    key={`${element.name}${index}`} {...getItemProps({
                                    item: element,
                                    index,
                                    disabled: element.name === "Loading..."
                                })}>
                                    {'tag' in element && <span>{element.tag}<br/></span>}
                                    <span className={"course-name"}>{element.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>

            </div>
        )

    }

    return <SearchBox/>;
}