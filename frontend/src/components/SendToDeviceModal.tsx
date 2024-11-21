import React, {useState} from "react";
import {Autocomplete, Button, DialogContent, DialogTitle, IconButton, Modal, ModalDialog, Stack} from "@mui/joy";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import {PAD1_5} from "../constants.ts";
import {getReq, postReq} from "../net.ts";
import {DisplayObject} from "../../../common/Display.ts";
import toast from "react-hot-toast";

export default function SendToDeviceModal() {
    const [open, setOpen] = useState(false);
    const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
    const [serialNumber, setSerialNumber] = useState<string>("");

    function handleOpen() {
        getReq('/display').then((res: DisplayObject[]) => {
            if (res) {
                let newSerialNumbers: string[] = [];
                res.forEach((element: DisplayObject) => {
                    newSerialNumbers.push(element.displaySerial);
                });
                setSerialNumbers(newSerialNumbers);
            }
        }).catch();
        setSerialNumber("");
        setOpen(true);
    }

    function handleSend() {
        const data: DisplayObject = {
            displaySerial: serialNumber,
            displayPath: `${window.location.search}${window.location.hash}`,
            displayEnabled: true
        }
        postReq('/display/update', {
            data: data
        }).then((_res) => {
            toast.success(`Already send to ${serialNumber}`);
            setOpen(false);
        }).catch();
    }

    return (
        <React.Fragment>
            <IconButton onClick={() => handleOpen()}>
                <ScreenShareOutlinedIcon/>
            </IconButton>

            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Send to Device</DialogTitle>
                    <DialogContent>Send current page to the device with selected serial number.</DialogContent>
                    <Stack spacing={PAD1_5}>
                        <Autocomplete
                            placeholder="Serial Number"
                            options={serialNumbers}
                            value={serialNumber}
                            onChange={(_e, v) => setSerialNumber(v || serialNumber)}
                        />
                        <Button onClick={() => handleSend()}>
                            Send
                        </Button>
                    </Stack>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
