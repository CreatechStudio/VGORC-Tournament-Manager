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
import {useEffect, useState} from "react";
import {PAD} from "../constants.ts";
import {AdminObject} from "../../../common/Admin.ts";
import {getReq, postReq} from "../net.ts";
import toast from "react-hot-toast";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

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
        console.log(newData);
        setData(newData);
    }

    function parseIntegerResult(data: string, oldValue: number) {
        const d = data.trim();
        const value = parseInt(d);
        if (value === 0 && d === "0") {
            return 0;
        } else {
            return value || oldValue;
        }
    }

    return (
        <Accordion sx={{width: '100%'}}>
            <AccordionSummary>
                <Avatar color="primary">
                    <SettingsRoundedIcon />
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
                                onChange={(e) =>
                                    handleChangeData("playerDuration", parseIntegerResult(e.target.value, data.playerDuration))
                                }
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
                                onChange={(e) =>
                                    handleChangeData("eliminationAllianceCount", parseIntegerResult(e.target.value, data.eliminationAllianceCount))
                                }
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
