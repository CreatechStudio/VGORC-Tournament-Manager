import {
    Button,
    DialogTitle,
    FormControl, FormLabel, IconButton,
    Input,
    Modal,
    ModalClose,
    ModalDialog,
    Option,
    Select, Stack,
} from "@mui/joy";
import {useEffect, useState} from "react";
import {PAD} from "../constants.ts";
import {MatchGoalArrayItem, ScoreDetail} from "../utils/MatchGoal.ts";
import toast from "react-hot-toast";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function NewGoalModal({
    open,
    onClose,
    goals,
    details,
    setDetails,
    setCurrentGoalId
} : {
    open: boolean;
    onClose: () => void;
    goals: MatchGoalArrayItem[];
    details: ScoreDetail[];
    setDetails: (details: ScoreDetail[]) => void;
    setCurrentGoalId?: (id: string | null) => void;
}) {
    const [availableGoals, setAvailableGoals] = useState<MatchGoalArrayItem[]>([]);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const newAvailableGoals: MatchGoalArrayItem[] = [];
        goals.forEach((goal) => {
            if (details.findIndex(detail => detail.goalId === goal.id) === -1) {
                newAvailableGoals.push(goal);
            }
        });
        setAvailableGoals(newAvailableGoals);
    }, [goals, details]);

    function handleSubmit() {
        if (count === 0) {
            toast.error("Count must be greater than 0");
            return;
        }
        if (selectedGoalId === null) {
            toast.error("Match goal is not selected");
            return;
        }

        const newDetail: ScoreDetail = {
            goalId: selectedGoalId,
            count
        };

        setDetails([...details, newDetail]);

        if (setCurrentGoalId) {
            setCurrentGoalId(selectedGoalId);
        }

        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <ModalDialog>
                <ModalClose/>
                <DialogTitle>
                    New Goal
                </DialogTitle>
                <FormControl>
                    <FormLabel>Goal Type</FormLabel>
                    <Select
                        value={selectedGoalId}
                        onChange={(_e, value) => setSelectedGoalId(value)}
                    >
                        {
                            availableGoals.map((goal, index) => (
                                <Option value={goal.id} key={index}>
                                    {goal.name} ({goal.points})
                                </Option>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl>
                    <FormLabel>Current Count</FormLabel>
                    <Input
                        type="number"
                        placeholder="Count"
                        value={count}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                                setCount(value);
                            } else {
                                setCount(0);
                            }
                        }}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mt: PAD, flexGrow: 1}} gap={PAD}>
                        <IconButton variant="outlined" onClick={() => {
                            setCount(Math.max(0, count - 1));
                        }} sx={{width: '100%'}}>
                            <RemoveIcon/>
                        </IconButton>
                        <IconButton variant="outlined" onClick={() => {
                            setCount(count + 1);
                        }} sx={{width: '100%'}}>
                            <AddIcon/>
                        </IconButton>
                    </Stack>
                </FormControl>
                <Button onClick={() => handleSubmit()} sx={{mt: PAD}}>
                    Submit
                </Button>
            </ModalDialog>
        </Modal>
    );
}
