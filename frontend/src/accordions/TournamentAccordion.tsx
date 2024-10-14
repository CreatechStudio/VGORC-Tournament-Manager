import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar, Box, Button, ButtonGroup, IconButton,
    Input,
    ListItemContent, Table,
    Typography
} from "@mui/joy";
import EditNotificationsRoundedIcon from '@mui/icons-material/EditNotificationsRounded';
import {DivisionObject} from "../../../common/Division.ts";
import {LARGE_PART, PAD} from "../constants.ts";
import ChipInput from "../components/ChipInput.tsx";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {deleteReq, postReq} from "../net.ts";
import AddIcon from '@mui/icons-material/Add';
import {useState} from "react";
import {includes} from "../utils.ts";
import toast from "react-hot-toast";

export default function TournamentAccordion({
    divisions,
    setDivisions,
    disabled,
} : {
    divisions: DivisionObject[];
    setDivisions: (divisions: DivisionObject[]) => void;
    disabled?: boolean;
}) {
    const [localDivisions, setLocalDivisions] = useState<DivisionObject[]>(divisions);

    function handleSetFields(index: number, newFields: string[]) {
        const newDivisions = JSON.parse(JSON.stringify(localDivisions));
        newDivisions[index].fields = newFields;
        setLocalDivisions(newDivisions);
    }

    function handleSetDivisionName(index: number, newDivisionName: string) {
        const newDivisions = JSON.parse(JSON.stringify(localDivisions));
        newDivisions[index].divisionName = newDivisionName;
        setLocalDivisions(newDivisions);
    }

    function handleDelete(index: number) {
        const obj = localDivisions[index];
        if (includes(divisions, obj)) {
            deleteReq(`/division/delete/${obj.divisionName}`).then((res) => {
                setDivisions(res || divisions);
                const newDivisions = JSON.parse(JSON.stringify(localDivisions));
                newDivisions.splice(index, 1);
                setLocalDivisions(newDivisions);
            });
        } else {
            const newDivisions = JSON.parse(JSON.stringify(localDivisions));
            newDivisions.splice(index, 1);
            setLocalDivisions(newDivisions);
        }
    }

    function handleNew() {
        setLocalDivisions([...localDivisions, {
            divisionName: "",
            fields: []
        }]);
    }

    function handleSave() {
        let flag = false;
        const promises: Promise<unknown>[] = [];
        localDivisions.forEach((division) => {
            // 如果本地存在但是远端不存在或与远端的不同，那就更新这条记录
            if (!includes(divisions, division)) {
                console.log('Update', division.divisionName);
                flag = true;
                promises.push(postReq('/division/update', {
                    name: division.divisionName,
                    fields: division.fields,
                }).then((res) => {
                    setLocalDivisions(res || localDivisions);
                    setDivisions(res || divisions);
                }));
            }
        });
        Promise.all(promises).then(() => {
            if (!flag) {
                setLocalDivisions(divisions);
            }
            toast.success("Save successfully");
        });
    }

    return (
        <Accordion>
            <AccordionSummary>
                <Avatar color="success">
                    <EditNotificationsRoundedIcon />
                </Avatar>
                <ListItemContent>
                    <Typography level="title-md">Tournament Settings</Typography>
                    <Typography level="body-sm">
                        Enable or disable your notifications
                    </Typography>
                </ListItemContent>
            </AccordionSummary>
            <AccordionDetails sx={{pl: PAD, pr: PAD}}>
                <Table
                    borderAxis="xBetween"
                    sx={{
                        '& tr > :last-child': { textAlign: 'right' }
                    }}
                >
                    <thead>
                    <tr>
                        <td>
                            <Typography level="title-md">
                                Division
                            </Typography>
                        </td>
                        <td>
                            <Typography level="title-md">
                                Fields
                            </Typography>
                        </td>
                        <td>
                            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <ButtonGroup>
                                    <Button
                                        disabled={disabled}
                                        onClick={() => handleNew()}
                                        startDecorator={
                                            <AddIcon/>
                                        }
                                    >
                                        New Division
                                    </Button>
                                    <Button
                                        disabled={disabled}
                                        onClick={() => handleSave()}
                                    >
                                        Save
                                    </Button>
                                </ButtonGroup>
                            </Box>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        localDivisions.map((d, index) => (
                            <tr key={index}>
                                <td>
                                    <Input
                                        value={d.divisionName}
                                        sx={{maxWidth: `${LARGE_PART}%`, mb: PAD, mt: PAD}}
                                        variant="soft"
                                        disabled={disabled}
                                        placeholder="Division Name"
                                        onChange={(e) => handleSetDivisionName(index, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <ChipInput chips={d.fields} setChips={(fields) => {
                                        handleSetFields(index, fields);
                                    }} disabled={disabled}/>
                                </td>
                                <td>
                                    <IconButton onClick={() => handleDelete(index)}>
                                        <DeleteOutlineIcon/>
                                    </IconButton>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}
