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

import { showNotification } from "@api/Notifications";
import { proxyLazy } from "@utils/proxyLazy";
import definePlugin from "@utils/types";
import { filters, findAll, findByPropsLazy } from "@webpack";
import { Button } from "@webpack/common";

const SpotifySocket = findByPropsLazy("getActiveSocketAndDevice");
const SpotifyAPI = findByPropsLazy("SpotifyAPIMarker");

const ButtonClasses = findByPropsLazy("spotifyButtonLogo");
const ButtonClasses2 = proxyLazy(() => findAll(filters.byProps("button", "buttonSize")).find(m => Object.values(m).length === 2));
export default definePlugin({
    name: "AddToQueue",
    description: "Adds a button to add a song to the queue",
    authors: [],
    patches: [
        {
            find: "spotify-activity-sync-button",
            replacement: {
                match: /(\(function\(\i\){.{1,1500}spotify-activity-sync-button.{1,2000}return.{1,20}jsx.{1,400}children:)(\i)/,
                replace: "$1$self.renderAddToQueueButton($2),"
            }
        },
    ],


    renderAddToQueueButton(children: any[]) {
        if (children.length !== 2 || !children.find(c => c.key !== "spotify-activity-sync-button"))
            return children;
        children.splice(1, 0, <AddToQueue btnProps={children[1].props} />);
        return children;
    }
});


const AddToQueue: React.FC<{ btnProps: any; }> = ({ btnProps, }) => {
    return (
        <Button
            look={btnProps.look}
            color={btnProps.color}
            size={Button.Sizes.NONE}
            className={`${ButtonClasses2.button} ${ButtonClasses.iconButton} ${ButtonClasses.iconButtonSize} ${ButtonClasses2.buttonSize}`}
            onClick={async () => {
                const { socket } = SpotifySocket.getActiveSocketAndDevice();
                if (!socket) return showNotification({
                    title: "Add To Queue",
                    body: "You are not connected to Spotify. Open Spotify and try again.",
                    color: "var(--status-danger, red)",
                });
                const res = await SpotifyAPI.post(socket.accountId, socket.accessToken, {
                    url: `https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${btnProps.activity.sync_id}`
                });

                showNotification({
                    title: "Add To Queue",
                    body: res.status === 204 ? "Added to queue" : "Failed to add to queue",
                });

            }}>
            <svg className={ButtonClasses.listenAlongIcon} role="img" width="16" height="16" viewBox="0 0 256 256">
                <path fill="currentColor" d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm104,56H40a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Zm0,64H40a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Zm112-24a8,8,0,0,1-3.76,6.78l-64,40A8,8,0,0,1,168,200V120a8,8,0,0,1,12.24-6.78l64,40A8,8,0,0,1,248,160Zm-23.09,0L184,134.43v51.14Z" />
            </svg>
        </Button>
    );
};
