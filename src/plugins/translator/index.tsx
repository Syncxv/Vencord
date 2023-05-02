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

import { definePluginSettings } from "@api/settings";
import { disableStyle, enableStyle } from "@api/Styles";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

import { TranslateButton } from "./components/TranslateButton";
import { TranslateOptions } from "./components/TranslateOptions";
import { translationEngines } from "./constants";
import style from "./style.css?managed";
import * as TranslateAPI from "./TranslateAPI";


export const settings = definePluginSettings({
    shouldTranslateBeforeSending: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Translate your messages before sending them",
    },

    engine: {
        type: OptionType.SELECT,
        default: translationEngines.googleapi.id,
        description: "Select translate engine",
        options: Object.values(translationEngines).map(engine => ({
            label: engine.name,
            value: engine.id,
        })),
    },

    test: {
        description: " hey",
        type: OptionType.COMPONENT,
        component: () => <TranslateOptions closePopout={() => { }} />,
    }
});

export default definePlugin({
    name: "Translator",
    description: "Lets you translate messages",
    authors: [Devs.Aria],
    patches: [
        {
            find: ".activeCommandOption",
            replacement: {
                match: /(.)\.push.{1,30}disabled:(\i),.{1,20}\},"gift"\)\)/,
                replace: "$&;try{$2||$1.push($self.translateIcon(arguments[0]))}catch{}",
            }
        },

        {
            find: "Le.ZP)({",
            replacement: {
                match: /(function il\(e\){.{1,1000})isEnabled:!0,wrap:!0/,
                replace: "$1isEnabled:false,wrap:false"
            }
        }
    ],

    settings: settings,
    TranslateAPI,

    translateIcon: ErrorBoundary.wrap(TranslateButton, { noop: true }),


    start() {
        enableStyle(style);
    },

    stop() {
        disableStyle(style);
    }
});
