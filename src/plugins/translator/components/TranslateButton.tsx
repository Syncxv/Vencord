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


import { findByPropsLazy } from "@webpack";
import { Button, ButtonLooks, ButtonWrapperClasses, Tooltip } from "@webpack/common";

import { settings } from "../index";
import { TranslateIcon } from "./TranslateIcon";

interface Props {
    type: {
        analyticsName: string;
    };
}

const popoutMod = findByPropsLazy("Popout");

interface PopoutProps {
    "aria-controls"?: string;
    "aria-expanded": boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLButtonElement>;
}

interface OtherProps {
    isShown: false,
    position: "top" | "bottom" | "left" | "right";
}

export function TranslateButton(chatBoxProps: Props) {
    if (chatBoxProps.type.analyticsName !== "normal") return null;


    const { shouldTranslateBeforeSending } = settings.use(["shouldTranslateBeforeSending"]);
    const toggle = () => settings.store.shouldTranslateBeforeSending = !settings.store.shouldTranslateBeforeSending;


    return (
        <popoutMod.Popout
            renderPopout={({ closePopout }) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h1>hey</h1>
                    <Button onClick={closePopout}>Close</Button>
                </div>
            )}
            position="bottom"
            animation={popoutMod.Popout.Animation.NONE}
            align="left"
        >

            {(popoutProps: PopoutProps, otherPorps: OtherProps) => {
                console.log(popoutProps, otherPorps);
                return (
                    shouldTranslateBeforeSending
                        ? <Tooltip text="hi">
                            {(tooltipProps: any) => (
                                <div style={{ display: "flex" }}>
                                    <Button
                                        {...tooltipProps}
                                        {...popoutProps}
                                        onContextMenu={toggle}
                                        size=""
                                        look={ButtonLooks.BLANK}
                                        innerClassName={ButtonWrapperClasses.button}
                                        style={{ padding: "0 8px" }}
                                    >
                                        <TranslateIcon untranslate={!shouldTranslateBeforeSending} />
                                    </Button>
                                </div>
                            )}
                        </Tooltip>
                        : <Button
                            {...popoutProps}
                            onContextMenu={toggle}
                            size=""
                            look={ButtonLooks.BLANK}
                            innerClassName={ButtonWrapperClasses.button}
                            style={{ padding: "0 8px" }}
                        >
                            <TranslateIcon untranslate={!shouldTranslateBeforeSending} />
                        </Button>
                );
            }}
        </popoutMod.Popout>
    );

}

