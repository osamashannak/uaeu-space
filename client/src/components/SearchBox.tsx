<<<<<<< HEAD
import {useCombobox} from "downshift";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {DatalistContent, getFilter, SearchBoxProps} from "../utils/SearchBox";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {getCoursesList, getProfessorsList} from "../api/api";
import Fuse from "fuse.js";
import {da} from "date-fns/locale";


const SearchBoxElement = (props: SearchBoxProps) => {

    const SearchBox = () => {

        const nav = useNavigate();
        const [items, setItems] = useState<DatalistContent[]>([]);
        const [allItems, setAllItems] = useState<DatalistContent[]>([]);
        const {t} = useTranslation(namespaces.pages.home);
=======
'use client';

import {useCombobox} from "downshift";
import {useRef, useState} from "react";
import Fuse from "fuse.js";
import {useRouter} from "next/navigation";
import styles from "@/styles/components/SearchBox.module.scss";
import {getCoursesList} from "@/api/course";
import {getProfessorsList} from "@/api/professor";
import {Item} from "@/interface/searchbox";


const SearchBoxElement = (props: {type: "professor" | "course"}) => {

    const SearchBox = () => {

        const [items, setItems] = useState<Item[]>([]);
        const [allItems, setAllItems] = useState<Item[]>([]);
        const lastInputValue = useRef<string>();
        const router = useRouter();
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

        const {
            inputValue,
            getMenuProps,
            getInputProps,
            highlightedIndex,
            getItemProps,
        } = useCombobox({
<<<<<<< HEAD
            async onInputValueChange({inputValue}) {
=======
            id: 'search-box',
            async onInputValueChange({inputValue}) {
                lastInputValue.current = inputValue;
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

                if (!inputValue) {
                    setItems([]);
                    return;
                }

<<<<<<< HEAD
                if (!allItems.length) {
                    setItems([{item: {name: "Loading...", tag: ""}}]);

                    const datalist: unknown = props.type === "course" ? await getCoursesList() : await getProfessorsList();

                    if (!datalist) return;

                    const newDatalist: DatalistContent[] = datalist as DatalistContent[];

                    let fuse;

                    if ('tag' in newDatalist[0]) {
                        fuse = new Fuse(newDatalist, {
=======
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
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
                            threshold: 0.4,
                            ignoreLocation: true,
                            keys: ['tag', 'name']
                        })
<<<<<<< HEAD
                    } else{
                        fuse = new Fuse(newDatalist, {
=======
                    } else {
                        fuse = new Fuse(datalist, {
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
                            threshold: 0.4,
                            ignoreLocation: true,
                            keys: ['name']
                        })
                    }

<<<<<<< HEAD
                    setAllItems(newDatalist);
                    setItems(fuse.search(inputValue, {limit: 5}) as unknown as DatalistContent[]);
=======
                    setAllItems(datalist);

                    setItems(fuse.search(lastInputValue.current as string, {limit: 5}).map((result) => result.item));

>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
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
<<<<<<< HEAD
                setItems((fuse.search(inputValue, {limit: 5}) as unknown as DatalistContent[]) || [""]);
=======

                setItems(fuse.search(lastInputValue.current as string, {limit: 5}).map((result) => result.item));
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

            },
            items,
            itemToString(item) {
<<<<<<< HEAD
                return item ? item.item.name : "";
            },
            onSelectedItemChange: ({selectedItem: newSelectedItem}) => {
                if (!newSelectedItem) return;
                if ('email' in newSelectedItem.item) {
                    nav(`/professor/${newSelectedItem.item.email}`);
                } else {
                    nav(`/course/${newSelectedItem.item.tag}`);
=======
                return item ? item.name : "";
            },
            onSelectedItemChange: ({selectedItem: newSelectedItem}) => {
                if (!newSelectedItem) return;
                if ('email' in newSelectedItem) {
                    router.push(`/professor/${newSelectedItem.email}`);
                } else {
                    router.push(`/course/${newSelectedItem.tag}`);
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

                }
            }
        })

        return (
<<<<<<< HEAD
            <div>

                <label className={"icon-label"}>
                    <input placeholder={t(`${props.type}_box.search_placeholder`)}
                           className={"search-bar"} {...getInputProps()}/>
                </label>

                <div className={"parent-datalist"}>
                    <ul className={"datalist"} {...getMenuProps()}>
                        {inputValue &&
                            items.map((element, index) => (
                                <li className={`datalist-option ${highlightedIndex === index && ' bg-blue-option'}`}
                                    key={`${element.item.name}${index}`} {...getItemProps({
                                    item: element.item as unknown as DatalistContent,
                                    index,
                                    disabled: element.item.name === "Loading..."
                                })}>

                                    <span>{'tag' in element.item && element.item.tag}</span>
                                    <span className={"course-name"}>{element.item.name}</span>
=======
            <div className={styles.searchBox}>
                <input placeholder={props.type === "course" ? "Search for a course..." : "Search for a professor..."}
                       className={styles.searchBar} {...getInputProps()}/>
                <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24">
                    <path fill="currentColor"
                          d="m18.9 20.3l-5.6-5.6q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.625 5.625q.275.275.275.675t-.3.7q-.275.275-.7.275t-.7-.275ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"/>
                </svg>


                <div className={styles.parentDataList}>
                    <ul className={styles.datalist} style={{backgroundColor: props.type === "course" ? "#ADFFFD" : "#FAFAFA"}} {...getMenuProps()}>
                        {inputValue &&
                            items.map((element, index) => (
                                <li className={`${styles.datalistOption} ${highlightedIndex === index && ` ${styles.bgBlueOption}`}`}
                                    key={`${element.name}${index}`} {...getItemProps({
                                    item: element,
                                    index,
                                    disabled: element.name === "Loading..."
                                })}>
                                    {'tag' in element && <span>{element.tag}<br/></span>}
                                    <span className={"course-name"}>{element.name}</span>
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
                                </li>
                            ))
                        }
                    </ul>
                </div>

<<<<<<< HEAD
                {/*<p><Link className={"help-course"} to={'/report'}>{t(`${props.type}_box.not_found`)}</Link></p>*/}

=======
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
            </div>
        )

    }

    return <SearchBox/>;
}

export default SearchBoxElement;