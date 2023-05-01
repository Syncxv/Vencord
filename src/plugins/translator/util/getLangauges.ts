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

import { Language } from "../constants";

export const getLanguages = (langs: string[], auto: boolean): Language[] => {


    const englishLanguageNames = new Intl.DisplayNames(["en"], { type: "language" });

    const nativeLanguageNames = langs.reduce((acc, lang) => {
        try {
            acc[lang] = new Intl.DisplayNames([lang], { type: "language" });
        } catch (error) {
            console.warn(`Unsupported language: ${lang}`);
        }
        return acc;
    }, {} as { [key: string]: Intl.DisplayNames; });


    const languageNames: Language[] = langs
        .map(lang => {
            const nativeName = lang in nativeLanguageNames ? nativeLanguageNames[lang].of(lang)! : null;
            return ({
                id: lang,
                englishName: englishLanguageNames.of(lang)!,
                nativeName: nativeName,
            });
        });

    // if (auto) languageNames.unshift({
    //     id: "auto",
    //     englishName: "Detect Language",
    //     nativeName: null,
    // });
    return languageNames;

};
