import {ReactNode, useState} from "react";
import {
    Box,
    Button,
    DialogTitle,
    Divider,
    List,
    ListItem,
    Modal,
    ModalDialog,
    Typography
} from "@mui/joy";
import {PAD} from "../constants.ts";

export function useHistoryModal(): [
    (open: boolean) => void,
    (history: number[]) => void,
    ReactNode
] {
    const [open, setOpen] = useState(false);
    const [history, setHistory] = useState<number[]>([]);

    function HistoryModal() {
        return (
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>History Score</DialogTitle>
                    <List>
                        {
                            history.map((score, index) => (
                                <ListItem key={index}>
                                    <Box sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                        width: '100%'
                                    }}>
                                        <Typography>
                                            History {index+1}
                                        </Typography>
                                        <Divider orientation="vertical" sx={{ml: PAD, mr: PAD}}/>
                                        <Button sx={{flexGrow: 1}} variant="plain" color="neutral">
                                            {score}
                                        </Button>
                                    </Box>
                                </ListItem>
                            ))
                        }
                    </List>
                    {
                        history.length > 0 ? <></> : (
                            <Typography sx={{width: '100%', textAlign: 'center', pb: PAD}}>
                                Nothing here
                            </Typography>
                        )
                    }
                </ModalDialog>
            </Modal>
        );
    }

    return [
        setOpen,
        setHistory,
        <HistoryModal/>
    ];
}
