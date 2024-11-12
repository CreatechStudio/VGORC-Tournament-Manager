import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar, Button,
    FormControl, FormHelperText, FormLabel, Input,
    ListItemContent,
    Table,
    Typography
} from "@mui/joy";
import TapAndPlayRoundedIcon from '@mui/icons-material/TapAndPlayRounded';
import {useEffect, useState} from "react";
import {PAD} from "../constants.ts";
import {AdminObject} from "../../../common/Admin.ts";
import {getReq, postReq} from "../net.ts";
import toast from "react-hot-toast";

export default function BasicAccordion({
    disabled
} : {
    disabled: boolean
}) {
    const [data, setData] = useState<AdminObject>({
        playerDuration: 60,
        eliminationAllianceCount: 5
    });

    useEffect(() => {
        getReq("/admin").then((res) => {
            if (res) {
                setData(res);
            }
        }).catch();
    }, []);

    function handleSave() {
        postReq("/admin/update", {
            data: data
        }).then((res) => {
            if (res) {
                setData(res);
                toast.success("Save successfully");
            }
        }).catch(() => {
            toast.error("Failed to save data");
        });
    }

    function handleChangeData(k: string, value: any) {
        const newData: AdminObject = JSON.parse(JSON.stringify(data));
        // @ts-ignore
        newData[k] = value;
        setData(newData);
    }

    return (
        <Accordion sx={{width: '100%'}}>
            <AccordionSummary>
                <Avatar color="primary">
                    <TapAndPlayRoundedIcon />
                </Avatar>
                <ListItemContent>
                    <Typography level="title-md">General Settings</Typography>
                    <Typography level="body-sm">
                        General settings for a tournament
                    </Typography>
                </ListItemContent>
                <Button variant="soft" onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleSave();
                }} disabled={disabled}>
                    Save
                </Button>
            </AccordionSummary>
            <AccordionDetails>
                <Table size="lg">
                    <tbody>
                    <tr>
                        <td>
                            <FormControl sx={{p: PAD}}>
                                <FormLabel>Duration / Match</FormLabel>
                                <FormHelperText>
                                    in second
                                </FormHelperText>
                            </FormControl>
                        </td>
                        <td>
                            <Input
                                variant="soft"
                                value={data.playerDuration}
                                type="number"
                                onChange={(e) => handleChangeData("playerDuration", +e.target.value)}
                                sx={{flexGrow: 1}}
                                disabled={disabled}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <FormControl sx={{p: PAD}}>
                                <FormLabel>Elimination Alliances</FormLabel>
                                <FormHelperText>
                                    Number of alliances advanced to elimination.
                                </FormHelperText>
                            </FormControl>
                        </td>
                        <td>
                            <Input
                                variant="soft"
                                value={data.eliminationAllianceCount}
                                type="number"
                                onChange={(e) => handleChangeData("eliminationAllianceCount", +e.target.value)}
                                sx={{flexGrow: 1}}
                                disabled={disabled}
                            />
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}
