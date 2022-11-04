import { get } from 'svelte/store';
import { user } from "./stores.js";

const baseUrl = "/api"; // Will be changed later when an nginx proxy is set up

export const API = async (/** @type {string} */ url, { method = null, body = null, headers = {} } = {}) => {
    headers["Accept"] = "application/json";

    const user_data = get(user);
    if (user_data) {
        headers["Authorization"] = `Bearer ${user_data.token}`;
    }
    if (body) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${baseUrl}/${url}`, {
        method: method || body ? 'POST' : 'GET',
        headers: headers,
        body: body ? JSON.stringify(body) : undefined
    });

    try {
        const data = await response.json();
        return [data.status, data];
    } catch {
        return [false, { status: false, message: "An error occured!" }];
    }

}