import React, {useRef, useState} from "react";
import {
    Box,
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
import PrintIcon from '@mui/icons-material/Print';
import {useReactToPrint} from "react-to-print";
import {PAD, PAD2, PICTURES} from "../constants.ts";

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
    const [selectedImage, setSelectedImage] = useState("");
    const originalTitle = useRef(document.title);

    const handleOpen = () => {
        setOpen(true);
        document.title = title;
        const randomImage = PICTURES[Math.floor(Math.random() * PICTURES.length)].url;
        setSelectedImage(randomImage);
    };

    return (
        <React.Fragment>
            <IconButton onClick={handleOpen}>
                <PrintIcon/>
            </IconButton>
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                    document.title = originalTitle.current;
                }}
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
                            stripe="odd"
                        >
                            <thead>
                            <tr>
                                <th colSpan={head.length} style={{textAlign: 'center', borderRadius: 0}}>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        flexDirection: 'row', p: PAD
                                    }}>
                                        <Typography level="title-lg">
                                            {title}
                                        </Typography>
                                        <img src={selectedImage} alt="Logo" style={{height: `${PAD2}vh`}}/>
                                    </Box>
                                </th>
                            </tr>
                            <tr>
                                {
                                    head.map((h, i) => (
                                        <th key={i} style={{borderRadius: 0}}>
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
                                                <td key={i} style={{borderRadius: 0}}>
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
