'use client';

import React, { useState, ChangeEvent } from 'react';

interface AutoCompleteTextProps {
    listItems: ListItem[];
    suggestionSelectedCallback?: (listItem: ListItem) => void;
    placeHolder?: string;
    [key: string]: any;
}
const AutoCompleteText = ({ listItems, suggestionSelectedCallback, placeHolder }: AutoCompleteTextProps) => {
    const [suggestions, setSuggestions] = useState<ListItem[]>(listItems);
    const [text, setText] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isValidInput, setIsValidInput] = useState<boolean>(true);

    const onFocus = () => {
        setIsFocused(true);
    }
    const onBlur = () => {
        setIsFocused(false);
        if (text) {
            const matchedItems = listItems.filter(item => item.text.toLowerCase() === text.toLowerCase());

            const isValid = matchedItems.length == 1;
            setIsValidInput(isValid);

            if (isValid && suggestionSelectedCallback) {
                suggestionSelectedCallback(matchedItems[0]);
            }
        }
        else {
            setIsValidInput(true);
        }
    }

    const onTextChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value;
        let filteredSuggestions: ListItem[] = [];
        if (searchText.length > 0) {
            const regex = new RegExp(`^${searchText}`, 'i');
            filteredSuggestions = listItems.filter((v) => regex.test(v.text));
            setSuggestions(filteredSuggestions);
        }
        else {
            setSuggestions(listItems);
        }
        setText(searchText);
    }

    const suggestionSelected = (listItem: ListItem) => {
        setText(listItem.text);
        setSuggestions([]);

        // if (suggestionSelectedCallback) {
        //     suggestionSelectedCallback(listItem);
        // }
    }

    const renderSuggestions = () => {
        if (!isFocused || suggestions.length === 0) {
            return null;
        }
        return (
            <ul className="absolute z-10  mt-2 bg-white border rounded shadow-lg max-h-48 overflow-y-auto w-full">
                {suggestions.map((item, index) => {
                    return (
                        <li
                            // onMouseDown will trigger before textbox onBlur
                            onMouseDown={() => suggestionSelected(item)}
                            key={item.id}
                            className={`cursor-pointer px-3 py-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-blue-200`}
                        >
                            {item.text}
                        </li>
                    )
                })}
            </ul>
        );
    }

    return (
        <div className="relative w-48">
            <input
                value={text}
                onChange={onTextChanged}
                onFocus={onFocus}
                onBlur={onBlur}
                type="text"
                placeholder={placeHolder}
                className={
                    `w-full pl-3 pr-10 py-1 border rounded-full  focus:outline-none 
                    ${!isValidInput ? 'border-red-500 ' : ''}`
                }
            />
            {renderSuggestions()}
        </div>
    );
}

export default AutoCompleteText;

export type {
    AutoCompleteTextProps
}
