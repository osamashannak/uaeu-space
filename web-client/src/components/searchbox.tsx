import {useCombobox} from "downshift";
import {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "../styles/components/global/searchbox.module.scss";
import type {CourseItem, Item, ProfessorItem} from "../typed/searchbox.ts";
import {getCoursesList} from "../api/course.ts";
import {getProfessorsList} from "../api/professor.ts";
import {UniversityContext} from "../pages/professor_lookup.tsx";
import {createSearchIndex, searchPreparedIndex} from "../lib/search.ts";
import type {PreparedSearchIndex, SearchMode} from "../lib/search.ts";

interface LoadingItem {
    disabled: true;
    name: string;
}

type SearchBoxItem = Item | LoadingItem;

const LOADING_ITEM: LoadingItem = {
    disabled: true,
    name: "Loading...",
};
const PROFESSOR_CACHE_PREFIX = "professor:";
const COURSE_CACHE_KEY = "course";
const SEARCH_RESULTS_LIMIT = 5;

function isLoadingItem(item: SearchBoxItem): item is LoadingItem {
    return "disabled" in item;
}

function isProfessorItem(item: SearchBoxItem): item is ProfessorItem {
    return "email" in item;
}

function isCourseItem(item: SearchBoxItem): item is CourseItem {
    return "tag" in item;
}

function isSupportedSearchMode(type: SearchBoxProps["type"]): type is SearchMode {
    return type === "professor" || type === "course";
}

type SearchBoxProps = { type: "professor" | "course" | "restaurant" };

export default function SearchBox(props: SearchBoxProps) {
    const {university} = useContext(UniversityContext);
    const searchMode = isSupportedSearchMode(props.type) ? props.type : null;
    const searchKey = searchMode === "course"
        ? COURSE_CACHE_KEY
        : searchMode === "professor" && university
            ? `${PROFESSOR_CACHE_PREFIX}${university}`
            : null;

    const [items, setItems] = useState<SearchBoxItem[]>([]);
    const lastInputValue = useRef("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchCache = useRef(new Map<string, PreparedSearchIndex>());
    const pendingSearches = useRef(new Map<string, Promise<PreparedSearchIndex | undefined>>());
    const activeSearchId = useRef(0);
    const navigate = useNavigate();

    const ensureSearchIndex = async (activeSearchKey: string, activeSearchMode: SearchMode): Promise<PreparedSearchIndex | undefined> => {
        const cachedIndex = searchCache.current.get(activeSearchKey);

        if (cachedIndex) {
            return cachedIndex;
        }

        const pendingIndex = pendingSearches.current.get(activeSearchKey);

        if (pendingIndex) {
            return pendingIndex;
        }

        const loadSearchIndex = (async () => {
            const dataList = activeSearchMode === "course"
                ? await getCoursesList()
                : await getProfessorsList(activeSearchKey.slice(PROFESSOR_CACHE_PREFIX.length));

            if (!dataList) {
                return undefined;
            }

            const preparedIndex = createSearchIndex(dataList, activeSearchMode);
            searchCache.current.set(activeSearchKey, preparedIndex);

            return preparedIndex;
        })();

        pendingSearches.current.set(activeSearchKey, loadSearchIndex);

        try {
            return await loadSearchIndex;
        } finally {
            pendingSearches.current.delete(activeSearchKey);
        }
    };

    const runSearch = async (nextInputValue?: string | null) => {
        const rawInputValue = nextInputValue ?? "";
        lastInputValue.current = rawInputValue;

        if (!searchMode || !rawInputValue.trim() || !searchKey) {
            setItems([]);
            return;
        }

        if (!searchCache.current.has(searchKey) && !pendingSearches.current.has(searchKey)) {
            setItems([LOADING_ITEM]);
        }

        const searchId = ++activeSearchId.current;
        const searchIndex = await ensureSearchIndex(searchKey, searchMode);

        if (searchId !== activeSearchId.current) {
            return;
        }

        if (!searchIndex || !lastInputValue.current.trim()) {
            setItems([]);
            return;
        }

        setItems(searchPreparedIndex(searchIndex, lastInputValue.current, SEARCH_RESULTS_LIMIT));
    };

    const {
        inputValue,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,

    } = useCombobox<SearchBoxItem>({
        id: 'search-box',
        onInputValueChange({inputValue: nextInputValue}) {
            void runSearch(nextInputValue);
        },
        items,
        isItemDisabled(item: SearchBoxItem): boolean {
            return isLoadingItem(item);
        },
        itemToString(item) {
            return item ? item.name : "";
        },
        onSelectedItemChange: ({selectedItem: newSelectedItem}) => {
            if (!newSelectedItem || isLoadingItem(newSelectedItem)) {
                return;
            }

            inputRef.current?.blur();

            if (isProfessorItem(newSelectedItem)) {
                navigate(`/professor/${newSelectedItem.email}`);
            } else if (isCourseItem(newSelectedItem)) {
                navigate(`/course/${newSelectedItem.tag}`);
            }
        }
    });

    useEffect(() => {
        if (!lastInputValue.current.trim()) {
            setItems([]);
            return;
        }

        if (!searchKey || !searchMode) {
            setItems([]);
            return;
        }

        void runSearch(lastInputValue.current);
    }, [searchKey]);

    return (
        <div className={styles.searchBox}>
            <input
                {...getInputProps({
                    className: styles.searchBar,
                    placeholder: `Search for a ${props.type}...`,
                    ref: inputRef,
                })}
            />
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
                                style={isLoadingItem(element) ? {pointerEvents: "none"} : {}}
                                key={`${element.name}${index}`} {...getItemProps({
                                item: element,
                                index,
                            })} >
                                {isLoadingItem(element) && <span>{element.name}</span>}
                                {isCourseItem(element) &&
                                    <>
                                            <span>
                                                {element.tag}<br/>
                                            </span>
                                        <span>{element.name}</span>
                                    </>
                                }
                                {isProfessorItem(element) &&
                                    <div className={styles.professorItem}>
                                        <span className={styles.professorName}>{element.name}</span>
                                        <span className={styles.email}>
                                                    {element.email}
                                                </span>
                                    </div>}
                            </li>
                        ))
                    }
                </ul>
            </div>

        </div>
    )

}

