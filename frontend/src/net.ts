// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as axios from "axios";
import toast from "react-hot-toast";
import {RETURN_URL_PARAM_KEY} from "./constants.ts";
// @ts-expect-error no type declare
import Base64 from "base-64";

const axiosInstance = axios.default.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    withCredentials: true
});

function solveErr(e: never) {
    if (e.response.status === 401) {
        toast.error("Unauthorized");
        setTimeout(() => {
            // 未认证回弹
            window.location.href = `/login?${RETURN_URL_PARAM_KEY}=${Base64.encode(window.location.href)}`;
        }, 1000);
    } else {
        toast.error(e.response.data || e.message || "Something went wrong");
    }
}

export async function getReq(url: string) {
    try {
        const res = await axiosInstance.get(url);
        return res.data;
    } catch (e) {
        solveErr(e);
        throw e;
    }
}

export async function postReq(url: string, data = {}) {
    try {
        const res = await axiosInstance.post(url, data);
        return res.data;
    } catch (e) {
        solveErr(e);
        throw e;
    }
}

export async function deleteReq(url: string) {
    try {
        const res = await axiosInstance.delete(url);
        return res.data;
    } catch (e) {
        solveErr(e);
        throw e;
    }
}

export function logout() {
    const date= new Date();
    date.setTime(date.getTime()-10000);
    const keys=document.cookie.match(/[^ =;]+(?==)/g);
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

export function handleReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get(RETURN_URL_PARAM_KEY);
    if (returnUrl) {
        window.location.href = Base64.decode(returnUrl) || "/";
    } else {
        window.location.href = "/";
    }
}
