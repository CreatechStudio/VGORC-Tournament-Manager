// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as axios from "axios";
import toast from "react-hot-toast";
import {RETURN_URL_KEY} from "./constants.ts";
// @ts-expect-error no type declare
import Base64 from "base-64";
import {sha256} from "js-sha256";

const axiosInstance = axios.default.create({
    withCredentials: true,
    timeout: 5000
});

interface TempData {
    data: never,
    startTime: number
}

const temp: {[Keys: string]: TempData} = {};
const TEMP_STORE_TIME = 1000;  // ms

function solveErr(e: never) {
    if (e.response.status === 401) {
        toast.error("Unauthorized", {id: "net-401"});
        setTimeout(() => {
            // 未认证回弹
            toLogin();
        }, 1000);
    } else if (e.response.status === 500) {
        toast.error("Backend is down, please try again later", {id: "net-500"});
    } else {
        toast.error(e.response.data || e.message || "Something went wrong", {id: "net-err"});
    }
}

function getTempKey(url: string, data?: never) {
    if (!data) return url;
    return url + sha256(JSON.stringify(data));
}

function insertTemp(tempKey: string, data: never) {
    const current = new Date().getTime();
    temp[tempKey] = {
        data: data,
        startTime: current
    };

    // 删除超时的数据
    setTimeout(() => {
        for (let i = 0; i < temp.length; i++) {
            if (current - temp[i].startTime > TEMP_STORE_TIME) {
                temp[i] = undefined;
            }
        }
    }, 0);
}

function getTempData(tempKey: string) {
    const current = new Date().getTime();

    const d = temp[tempKey];
    if (d === undefined) {
        return undefined;
    } else {
        if (current - d.startTime > TEMP_STORE_TIME) {
            temp[tempKey] = undefined;
            return undefined;
        } else {
            return d.data;
        }
    }
}

export async function getReq(url: string) {
    const k = getTempKey(url);
    const d = getTempData(k);
    if (d !== undefined) return d;

    try {
        const res = await axiosInstance.get(`/api/${url}`);
        insertTemp(k, res.data);
        return res.data;
    } catch (e) {
        solveErr(e);
        throw e;
    }
}

export async function postReq(url: string, data = {}) {
    const k = getTempKey(url, data);
    const d = getTempData(k);
    if (d !== undefined) return d;

    try {
        const res = await axiosInstance.post(`/api/${url}`, data);
        insertTemp(k, res.data);
        return res.data;
    } catch (e) {
        solveErr(e);
        throw e;
    }
}

export async function deleteReq(url: string) {
    const k = getTempKey(url);
    const d = getTempData(k);
    if (d !== undefined) return d;

    try {
        const res = await axiosInstance.delete(`/api/${url}`);
        insertTemp(k, res.data);
        return res.data;
    } catch (e) {
        solveErr(e);
        throw e;
    }
}

export function logout() {
    const date= new Date();
    date.setTime(date.getTime() - 10000);
    const keys= document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
        for (let i = keys.length; i--;) {
            document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";
        }
    }
    toast.success("Logout successfully");
    setTimeout(() => {
        handleReturn();
    }, 1000);
}

interface ReturnUrl {
    params: string,
    hash: string
}

export function handleReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrlEncoded = urlParams.get(RETURN_URL_KEY);
    let returnUrl: ReturnUrl = {
        params: "",
        hash: "#"
    };
    if (returnUrlEncoded) {
        try {
            returnUrl = JSON.parse(Base64.decode(returnUrlEncoded));
        } catch {}
    }
    toLocation(returnUrl.hash, returnUrl.params);
}

export function toLocation(hash: string, params: {[Keys: string]: any} | string = {}) {
    if (hash.startsWith('#') || hash.startsWith('/')) {
        hash = hash.substring(1);
    }

    if (typeof params === "string") {
        window.location.href = `/?${params}#${hash}`;
    } else {
        const paramStrings = [];
        Object.keys(params).forEach((key) => {
            paramStrings.push(`${key}=${params[key]}`);
        });
        window.location.href = `/?${paramStrings.join('&')}#${hash}`;
    }
}

function generateReturnUrlString() {
    const url: ReturnUrl = {
        params: window.location.search,
        hash: window.location.hash
    }

    return Base64.encode(JSON.stringify(url));
}

export function toLogin() {
    const params = {};
    params[RETURN_URL_KEY] = generateReturnUrlString();
    toLocation("login", params);
}

export function PingPongTest(
    onSuccess?: () => void,
    onFailed?: () => void,
    onlyOnce: boolean = false
) {
    const es = new EventSource('/api//ping');

    es.addEventListener('message', (event) => {
        if (event.data === 'pong') {
            onSuccess?.();
            if (onlyOnce) es.close();
        }
    });

    es.onerror = () => {
        onFailed?.();
        es.close();
    };
}
