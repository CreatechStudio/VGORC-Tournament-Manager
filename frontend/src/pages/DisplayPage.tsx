import {useEffect, useState} from "react";
import {getReq} from "../net.ts";
import {DisplayObject} from "../../../common/Display.ts";
import {SERIAL_NUMBER_KEY} from "../constants.ts";

export default function DisplayPage() {
    const urlParam = new URLSearchParams(window.location.search);
    const serialNumber = urlParam.get(SERIAL_NUMBER_KEY) || "";

    const host = window.location.origin;
    const [displayData, setDisplayData] = useState<DisplayObject>({
        displaySerial: serialNumber,
        displayPath: "",
        displayEnabled: false
    });

    useEffect(() => {
        getData();
    }, []);

    function getData() {
        getReq(`/display/${serialNumber}`).then((res: DisplayObject) => {
            if (res) {
                setDisplayData(res)
            }

            setTimeout(() => {
                getData();
            }, 5000);
        }).catch();
    }

    function getDisplayPath() {
        if (!displayData.displayEnabled) {
            return "";
        }
        let path = displayData.displayPath;
        if (path.startsWith('?')) {
            path = path.substring(1);
        }
        return path;
    }

    return (
        <iframe
            style={{
                border: "none",
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                top: 0,
                left: 0,
                padding: 0,
                margin: 0,
                overflow: 'hidden'
            }}
            src={`${host}?serialNumber=${serialNumber}&displayMode=1&${getDisplayPath()}`}
        />
    );
}
