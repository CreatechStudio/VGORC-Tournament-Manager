// @ts-expect-error read value of any object
export function compare<T>(o1: T, o2: T) {
    if (typeof o1 !== "object") {
        return o1 === o2;
    }
    // @ts-expect-error read value of any object
    return Object.keys(o1).every(key => compare(o1[key], o2[key]))
        // @ts-expect-error read value of any object
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
