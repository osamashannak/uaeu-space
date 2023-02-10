import {useCombobox} from "downshift";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {DatalistContent, getFilter, SearchBoxProps} from "../utils/SearchBox";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {getCoursesList, getProfessorsList} from "../api/api";


const SearchBoxElement = (props: SearchBoxProps) => {

    const SearchBox = () => {

        const nav = useNavigate();
        const [items, setItems] = useState<DatalistContent[]>([]);
        const [allItems, setAllItems] = useState<DatalistContent[]>([]);
        const {t} = useTranslation(namespaces.pages.home);

        const {
            inputValue,
            getMenuProps,
            getInputProps,
            highlightedIndex,
            getItemProps,
        } = useCombobox({
            async onInputValueChange({inputValue}) {

                if (!inputValue) {
                    setItems([]);
                    return;
                }

                if (!allItems.length) {
                    setItems([{name: "Loading...", tag: ""}]);

                    const datalist = props.type === "course" ? await getCoursesList() : await getProfessorsList();

                    if (!datalist) return;

                    setAllItems(datalist);
                    setItems((datalist as DatalistContent[]).filter(getFilter(inputValue, props.type)).slice(0, 5));
                    return;
                }

                setItems(allItems.filter(getFilter(inputValue, props.type)).slice(0, 5) || [""]);

            },
            items,
            itemToString(item) {
                return item ? item.name : "";
            },
            onSelectedItemChange: ({selectedItem: newSelectedItem}) => {
                if (!newSelectedItem) return;
                if ('email' in newSelectedItem) {
                    nav(`/professor/${newSelectedItem.email}`);
                } else {
                    nav(`/course/${newSelectedItem.tag}`);

                }
            }
        })

        return (
            <div>

                <label className={"icon-label"}>
                    <input placeholder={t(`${props.type}_box.search_placeholder`)}
                           className={"search-bar"} {...getInputProps()}/>
                </label>

                <div className={"parent-datalist"}>
                    <ul className={"datalist"} {...getMenuProps()}>
                        {inputValue &&
                            items.map((item, index) => (
                                <li className={`datalist-option ${highlightedIndex === index && ' bg-blue-option'}`}
                                    key={`${item.name}${index}`} {...getItemProps({
                                    item,
                                    index,
                                    disabled: item.name === "Loading..."
                                })}>

                                    <span>{'tag' in item && item.tag}</span>
                                    <span className={"course-name"}>{item.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                {/*<p><Link className={"help-course"} to={'/report'}>{t(`${props.type}_box.not_found`)}</Link></p>*/}

            </div>
        )

    }

    return <SearchBox/>;
}

export default SearchBoxElement;