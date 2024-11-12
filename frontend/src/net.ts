// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as axios from "axios";
import toast from "react-hot-toast";
import {RETURN_URL_KEY} from "./constants.ts";
// @ts-expect-error no type declare
import Base64 from "base-64";

const axiosInstance = axios.default.create({
    withCredentials: true,
    timeout: 5000
});

function solveErr(e: never) {
    if (e.response.status === 401) {
        toast.error("Unauthorized");
        setTimeout(() => {
            // 未认证回弹
            toLogin();
        }, 1000);
    } else {
        toast.error(e.response.data || e.message || "Something went wrong");
    }
}

export async function getReq(url: string) {
    try {
        const res = await axiosInstance.get(`/api/${url}`);
        return res.data;
    } catch (e) {
        solveErr(e);
        throw e;
    }
}

export async function postReq(url: string, data = {}) {
    try {
        const res = await axiosInstance.post(`/api/${url}`, data);
        return res.data;
    } catch (e) {
        solveErr(e);
        throw e;
    }
}

export async function deleteReq(url: string) {
    try {
        const res = await axiosInstance.delete(`/api/${url}`);
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
    params[RETURN_URL_KEY] = generateReturnUrlString();
    toLocation("login", params);
}

export function PingPongTest(
    onSuccess?: () => void,
    onFailed?: () => void
) {
    axiosInstance.get('/api//ping', {
        timeout: 1000
    }).then((res) => {
        if (res.data === "Pong!") {
            if (onSuccess) {
                onSuccess();
            }
        } else {
            if (onFailed) {
                onFailed();
            }
        }
    }).catch(() => {
        if (onFailed) {
            onFailed();
        }
    }).finally(() => {
        setTimeout(() => {
            PingPongTest(onSuccess, onFailed);
        }, 1000);
    });
}
