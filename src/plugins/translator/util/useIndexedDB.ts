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
import { useEffect, useState } from "@webpack/common";

type UseIndexedDBReturn<T> = {
    data: T | null,
    loading: boolean,
    updateData: (newValue: T) => Promise<void>,
    setData: (newValue: T) => void;
};


export function useIndexedDB<T = any>(key: IDBValidKey): UseIndexedDBReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const value = await DataStore.get<T>(key);
                setData(value ?? null);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [key]);

    const updateData = async (newValue: T) => {
        try {
            await DataStore.set(key, newValue);
            setData(newValue);
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return { data, loading, updateData, setData };
}
