import {ReactNode, useEffect, useState} from "react";
import {getNameFromMatchGoalId, getPointsFromMatchGoalId, MatchGoalArrayItem, ScoreDetail} from "../utils/MatchGoal.ts";
import {
    Box,
    Button,
    DialogTitle,
    Divider,
    List,
    ListItem,
    Modal, ModalClose,
    ModalDialog,
    Stack,
    Tooltip,
    Typography
} from "@mui/joy";
import {PAD} from "../constants.ts";

export default function useScoreDetailModal(): [
    (open: boolean) => void,
    (details: ScoreDetail[]) => void,
    (matchGoals: MatchGoalArrayItem[]) => void,
    (total: number) => void,
    ReactNode
] {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState<ScoreDetail[]>([]);
    const [goals, setGoals] = useState<MatchGoalArrayItem[]>([]);
    const [total, setTotal] = useState(0);
    const [formula, setFormula] = useState<string>("");

    useEffect(() => {
        const formulaParts: string[] = [];

        details.forEach((detail) => {
            formulaParts.push(`(${getPointsFromMatchGoalId(goals, detail.goalId)} × ${detail.count})`);
        });

        setFormula(formulaParts.join(" + "));
    }, [total]);

    function ScoreDetailModal() {
        return (
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <ModalClose/>
                    <DialogTitle>Score Detail</DialogTitle>
                    <List>
                        {
                            details.map((detail, index) => (
                                <ListItem key={index}>
                                    <Box sx={{
                                        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                        width: '100%'
                                    }}>
                                        <Typography>
                                            {getNameFromMatchGoalId(goals, detail.goalId)} ({getPointsFromMatchGoalId(goals, detail.goalId)})
                                        </Typography>
                                        <Divider orientation="vertical" sx={{ml: PAD, mr: PAD}}/>
                                        <Button sx={{flexGrow: 1}} variant="plain" color="neutral">
                                            {detail.count}
                                        </Button>
                                    </Box>
                                </ListItem>
                            ))
                        }
                    </List>
                    <Divider/>
                    <Stack width="100%" justifyContent="center" alignItems="center">
                        <Tooltip title={formula} variant="soft">
                            <Typography level="title-lg">
                                Total: {total}
                            </Typography>
                        </Tooltip>
                    </Stack>
                </ModalDialog>
            </Modal>
        );
    }

    return [
        setOpen,
        setDetails,
        setGoals,
        setTotal,
        <ScoreDetailModal/>
    ];
}
