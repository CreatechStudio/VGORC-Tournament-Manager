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
    return  db.getData().settings.adminData.playerDuration;
}

export function getTime(key: string) {
    if (timers[key]) {
        const cur = new Date().getTime();
        timers[key].time += (cur - timers[key].start) / 1000;
        timers[key].start = cur;
        return timers[key].time;
    } else {
        return 0;
    }
}

export function repeatGetTime(totalTime: number, key: string, send: (data: object) => unknown, holding: boolean) {
    const repeat = () => {
        setTimeout(() => {
            repeatGetTime(totalTime, key, send, holding);
        }, 1000);
    }
    if (timers[key] === undefined || timers[key].status === TimeStatus.stopped) {
        // 如果挂起并且目标不存在，返回 0
        if (holding) {
            send({time: 0});
            repeat();
        }
        return;
    }
    const time = totalTime - getTime(key) + 1;
    if (time >= 0) {
        if (time > totalTime) {
            send({time: totalTime});
        } else {
            send({time: parseInt(time.toString())});
        }
        repeat();
    } else {
        send({time: 0});
        stopTimer(key);
    }
}

export function startTimer(key: string) {
    timers[key] = {
        status: TimeStatus.running,
        start: new Date().getTime(),
        time: 0
    };
}

export function stopTimer(key: string) {
    timers[key] = undefined;
}

export function pauseTimer(key: string) {
    if (timers[key] !== undefined) {
        timers[key].status = TimeStatus.stopped;
    }
}
