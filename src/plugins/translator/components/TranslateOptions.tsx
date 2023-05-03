/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { ModalProps, ModalRoot } from "@utils/modal";
import { Forms, Select, useState } from "@webpack/common";

import { LanguageTypes, MessageTypes, translationEngines } from "../constants";
import { settings } from "../index";
interface Props {
    modalProps: ModalProps;
}
const getKey = (type, langType) => `${type}_${langType}`;


export const TranslateOptions: React.FC<Props> = ({ modalProps }) => {
    return (
        <ModalRoot {...modalProps}
            className="tl-wrapper"
        >
            <Forms.FormTitle tag="h3">Translate</Forms.FormTitle>
            {Object.values(MessageTypes).map(type => {
                return Object.values(LanguageTypes).map(langType => {
                    return (
                        <LanguageSelectComponent
                            type={type}
                            langType={langType}
                            description={`${type} ${langType} language in ${type} messages`}
                        />
                    );
                });
            })}
        </ModalRoot>
    );
};


interface SettingSelectProps {
    type: string,
    langType: string,
    description: string;
    // options: { label: string; value: string; }[];
    onChange?: (value: string) => void;
}

export const LanguageSelectComponent: React.FC<SettingSelectProps> = ({ type, langType, description, onChange }) => {

    const key = getKey(type, langType);
    // const { data, updateData } = useIndexedDB<string>(key);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    // useEffect(() => {
    //     // Update the local state when data from IndexedDB changes
    //     setSelectedValue(data);
    // }, [data]);

    const handleChange = (newValue: string) => {
        setSelectedValue(newValue);

        // await updateData(newValue);
    };
    return (
        <Forms.FormSection className="tl-select-item">
            <div className="tl-description">
                <Forms.FormText>{description}</Forms.FormText>
            </div>
            <Select
                key={key}
                isDisabled={false}
                options={translationEngines[settings.store.engine!].languages.map(l => ({ label: `${l.englishName} ${l.nativeName != null ? `(${l.nativeName})` : ""}`, value: l.id }))}
                placeholder="Select an option"
                maxVisibleItems={5}
                closeOnSelect={true}
                select={v => {
                    console.log(v);
                    handleChange(v);
                    onChange != null && onChange(v);
                }}
                isSelected={v => v === selectedValue}
                serialize={v => v}
            />
        </Forms.FormSection>
    );
};
