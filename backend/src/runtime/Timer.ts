import {Utils} from "../Utils";

enum TimeStatus {
    running,
    stopped
}

interface Time {
    time: number,
    status: TimeStatus,
    start: number
}

let timers: {[key: string]: Time | undefined} = {}

export function getMatchDuration(){
    const db = new Utils();
    return  db.getData().settings.playerDuration;
}

export function getTime(key: string) {
    if (timers[key]) {
        const cur = new Date().getTime();
        timers[key].time += (cur - timers[key].start) / 1000;
        timers[key].start = cur;
        return timers[key].time;
    } else {
        timers[key] = {time: 0, status: TimeStatus.running, start: new Date().getTime()};
        return 0;
    }
}

export function repeatGetTime(totalTime: number, key: string, send: (data: object) => unknown) {
    if (timers[key]?.status === TimeStatus.stopped) {
        return;
    }
    const time = totalTime - getTime(key) + 1;
    if (time >= 0) {
        if (time > totalTime) {
            send({time: totalTime});
        } else {
            send({time: parseInt(time.toString())});
        }
        setTimeout(() => {
            repeatGetTime(totalTime, key, send);
        }, 1000);
    } else {
        send({time: 0});
        timers[key] = undefined;
    }
}

export function startTimer(key: string) {
    if (timers[key] !== undefined) {
        timers[key].start = new Date().getTime();
        timers[key].status = TimeStatus.running;
    }
}

export function stopTimer(key: string) {
    if (timers[key] !== undefined) {
        timers[key].status = TimeStatus.stopped;
        timers[key].time = 0;
    }
}

export function pauseTimer(key: string) {
    if (timers[key] !== undefined) {
        timers[key].status = TimeStatus.stopped;
    }
}