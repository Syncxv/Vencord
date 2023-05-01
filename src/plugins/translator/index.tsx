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
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

import { TranslateButton } from "./components/TranslateButton";

export const settings = definePluginSettings({
    shouldTranslate: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Toggle translate",
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
    ],

    settings: settings,

    translateIcon: ErrorBoundary.wrap(TranslateButton, { noop: true })


});
