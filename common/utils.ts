// @ts-nocheck

export function compare<T>(o1: T, o2: T) {
    if (typeof o1 !== "object" || typeof o2 !== "object") {
        return o1 === o2;
    }
    return Object.keys(o1).every(key => compare(o1[key], o2[key]))
        && Object.keys(o2).every(key => compare(o1[key], o2[key]));
}

export function indexOf<T>(array: T[], item: T): number {
    for (let i = 0; i < array.length; i++) {
        if (compare(array[i], item)) {
            return i;
        }
    }
    return -1;
}

export function includes<T>(array: T[], item: T): boolean {
    for (let i = 0; i < array.length; i++) {
        if (compare(array[i], item)) {
            return true;
        }
    }
    return false;
}
