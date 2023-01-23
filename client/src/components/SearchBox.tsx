import {useCombobox} from "downshift";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {DatalistContent, getCourseFilter, getProfFilter, SearchBoxProps} from "../utils/SearchBox";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";


const SearchBoxElement = (props: SearchBoxProps) => {

    const SearchBox = () => {

        const nav = useNavigate();
        const [items, setItems] = useState<DatalistContent[]>([]);
        const {t, i18n} = useTranslation(namespaces.pages.home);

        const {
            isOpen,
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
                props.type === "course" ?
                    setItems(props.datalist.filter(getCourseFilter(inputValue!)).slice(0, 5)) :
                    setItems(props.datalist.filter(getProfFilter(inputValue!)).slice(0, 5));
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
                        {isOpen &&
                            items.map((item, index) => (
                                <li
                                    className={`datalist-option ${(highlightedIndex === index && ' bg-blue-option')}`}
                                    key={`${item.name}${index}`}
                                    {...getItemProps({item, index})}
                                >
                                    <span>{'tag' in item && item.tag}</span>
                                    <span className={"course-name"}>{item.name}</span>
                                </li>))
                        }
                    </ul>
                </div>

                <p><Link className={"help-course"} to={'/report'}>{t(`${props.type}_box.not_found`)}</Link></p>

            </div>
        )

    }

    return <SearchBox/>;
}

export default SearchBoxElement;