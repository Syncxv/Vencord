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

import { DataStore } from "@api/index";
import { Toasts } from "@webpack/common";

import { Collection, Format, Gif } from "./types";
import { getFormat } from "./utils/getFormat";

export const DATA_COLLECTION_NAME = "gif-collections-collections";

// this is here bec async + react class component dont play nice and stutters happen. IF theres a better way of doing it pls let me know
export let cache_collections: Collection[] = [];


export const getCollection = async (name: string) => {
    const collections = await DataStore.get<Collection[]>(DATA_COLLECTION_NAME) ?? [];
    return collections.find(c => c.name === name);
};

export const getCachedCollection = (name: string) => cache_collections.find(c => c.name === name);

export const createCollection = async (name: string, gifs: Gif[]) => {

    const collections = await DataStore.get<Collection[]>(DATA_COLLECTION_NAME) ?? [];
    const duplicateCollection = collections.find(c => c.name === `gc:${name}`);
    if (duplicateCollection)
        return Toasts.show({
            message: "That collection already exists",
            type: Toasts.Type.FAILURE,
            id: Toasts.genId(),
            options: {
                duration: 3000,
                position: Toasts.Position.BOTTOM
            }
        });

    // gifs shouldnt be empty because to create a collection you need to right click an image / gif and then create it yk. but cant hurt to have a null-conditional check RIGHT?
    collections.push({
        name: `gc:${name}`,
        src: gifs[gifs.length - 1]?.src ?? "",
        format: getFormat(gifs[gifs.length - 1]?.src ?? ""),
        type: "Category",
        gifs
    });

    await DataStore.set(DATA_COLLECTION_NAME, collections);
    return await refreshCacheCollection();
};

export const addToCollection = async (name: string, gif: Gif) => {
    const collections = await DataStore.get<Collection[]>(DATA_COLLECTION_NAME) ?? [];
    const collectionIndex = collections.findIndex(c => c.name === name);
    if (collectionIndex === -1) return console.warn("collection not found");

    collections[collectionIndex].gifs.push(gif);
    collections[collectionIndex].src = gif.src;
    collections[collectionIndex].format = getFormat(gif.src);

    await DataStore.set(DATA_COLLECTION_NAME, collections);
    return await refreshCacheCollection();

};

export const removeFromCollection = async (id: string) => {
    const collections = await DataStore.get<Collection[]>(DATA_COLLECTION_NAME) ?? [];
    const collectionIndex = collections.findIndex(c => c.gifs.some(g => g.id === id));
    if (collectionIndex === -1) return console.warn("collection not found");

    // Remove The Gif
    collections[collectionIndex].gifs = collections[collectionIndex].gifs.filter(g => g.id !== id);

    const collection = collections[collectionIndex];
    // TODO: need to change default image eh
    const latestGifSrc = collection.gifs.length ? collection.gifs[collection.gifs.length - 1].src : "https://i.imgur.com/TFatP8r.png";
    collections[collectionIndex].src = latestGifSrc;
    collections[collectionIndex].format = latestGifSrc ? getFormat(latestGifSrc) : Format.IMAGE;

    await DataStore.set(DATA_COLLECTION_NAME, collections);
    return await refreshCacheCollection();
};

export const deleteCollection = async name => {

    const collections = await DataStore.get<Collection[]>(DATA_COLLECTION_NAME) ?? [];
    const col = collections.filter(c => c.name !== name);
    await DataStore.set(DATA_COLLECTION_NAME, col);
    await refreshCacheCollection();
};


export const refreshCacheCollection = async () => {
    cache_collections = await DataStore.get<Collection[]>(DATA_COLLECTION_NAME) ?? [];
};
