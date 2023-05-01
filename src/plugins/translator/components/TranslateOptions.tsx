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

import { Forms, Select, useState } from "@webpack/common";

import { translationEngines } from "../constants";
import { settings } from "../index";
import { TranslateData } from "../TranslateAPI";
interface Props {
    closePopout: () => void;
}
export const TranslateOptions: React.FC<Props> = ({ closePopout }) => {
    const [data, setData] = useState<TranslateData>({
        input: {
            name: "",
            id: ""
        },
        output: {
            name: "",
            id: ""
        },
        text: "hehe"

    });
    return (
        <div
            style={{
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: "var(--background-secondary)"
            }}
            className="tl-wrapper"
        >
            <Forms.FormSection>
                <Forms.FormTitle tag="h3">Translate</Forms.FormTitle>
                <SettingSelectComponent description="Input Language" options={translationEngines[settings.store.engines!].languages.map(l => ({ label: l, value: l }))} onChange={() => { }} />
            </Forms.FormSection>


        </div>
    );
};


interface SettingSelectProps {
    description: string;
    options: { label: string; value: string; }[];
    def?: string;
    onChange: (value: string) => void;
}

export const SettingSelectComponent: React.FC<SettingSelectProps> = ({ options, def, description, onChange }) => {

    const [state, setState] = useState<string | undefined>(def);


    return (
        <Forms.FormSection>
            <Forms.FormTitle>{description}</Forms.FormTitle>
            <Select
                isDisabled={false}
                options={options}
                placeholder="Select an option"
                maxVisibleItems={5}
                closeOnSelect={true}
                select={v => {
                    setState(v);
                    onChange(v);
                }}
                isSelected={v => v === state}
                serialize={v => String(v)}
            />
        </Forms.FormSection>
    );
};
