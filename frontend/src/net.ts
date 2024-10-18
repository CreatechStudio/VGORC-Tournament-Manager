import * as axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.default.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
});

function solveErr(e: unknown) {
    // @ts-expect-error solve unknown error
    toast.error(e.response.data || e.message || "Something went wrong");
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
