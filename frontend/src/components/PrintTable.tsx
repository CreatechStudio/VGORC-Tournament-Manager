import {
    Button,
    DialogContent,
    DialogTitle,
    IconButton,
    Modal,
    ModalClose,
    ModalDialog,
    Table,
    Typography
} from "@mui/joy";
import React, {useRef, useState} from "react";
import PrintIcon from '@mui/icons-material/Print';
import {useReactToPrint} from "react-to-print";
import {PAD, PAD2} from "../constants.ts";

export default function PrintTable({
    head,
    body,
    title
} : {
    head: string[],
    body: any[][],
    title: string
}) {
    const tableRef = useRef<HTMLTableElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: tableRef,
    });
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <IconButton onClick={() => {
                setOpen(true);
            }}>
                <PrintIcon/>
            </IconButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <ModalDialog layout="fullscreen" sx={{p: PAD2}}>
                    <ModalClose/>
                    <DialogTitle>
                        Print Table
                    </DialogTitle>
                    <DialogContent sx={{p: PAD}}>
                        <Button
                            onClick={() => {
                                console.log(head, body);
                                handlePrint();
                            }}
                            variant="soft"
                            sx={{mb: PAD2}}
                        >
                            Print
                        </Button>
                        <Table
                            ref={tableRef}
                            borderAxis="both"
                        >
                            <thead>
                            <tr>
                                <th colSpan={head.length} style={{textAlign: 'center'}}>
                                    <h2>
                                        {title}
                                    </h2>
                                </th>
                            </tr>
                            <tr>
                                {
                                    head.map((h, i) => (
                                        <th key={i}>
                                            <Typography level="title-md" sx={{textAlign: 'center'}}>
                                                {h}
                                            </Typography>
                                        </th>
                                    ))
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {
                                body.map((b, index) => (
                                    <tr key={index}>
                                        {
                                            b.map((item, i) => (
                                                <td key={i}>
                                                    <Typography level="body-md" sx={{textAlign: 'center'}}>
                                                        {item}
                                                    </Typography>
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                            <tfoot>

                            </tfoot>
                        </Table>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}