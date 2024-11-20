import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar, IconButton, Input,
    ListItemContent, Switch,
    Table,
    Typography
} from "@mui/joy";
import {useEffect, useState} from "react";
import {getReq, postReq} from "../net.ts";
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import {DisplayObject} from "../../../common/Display.ts";
import SaveIcon from '@mui/icons-material/Save';
import toast from "react-hot-toast";

export default function DisplayAccordion() {
    const [displayData, setDisplayData] = useState<DisplayObject[]>([]);

    useEffect(() => {
        getReq('/display').then((res) => {
            if (res) {
                setDisplayData(res);
            }
        }).catch();
    }, []);

    function handleChange(index: number, displayKey: string, value: any) {
        const newData: DisplayObject[] = JSON.parse(JSON.stringify(displayData));
        // @ts-ignore
        newData[index][displayKey] = value;
        setDisplayData(newData);
    }

    function handleSaveByIndex(index: number) {
        postReq('/display/update', {
            data: displayData[index]
        }).then((res) => {
            if (res) {
                setDisplayData(res);
                toast.success("Save successfully");
            }
        });
    }

    return (
        <Accordion>
            <AccordionSummary>
                <Avatar color="neutral">
                    <DisplaySettingsIcon />
                </Avatar>
                <ListItemContent>
                    <Typography level="title-md">Display Actions</Typography>
                    <Typography level="body-sm">
                        Change display status of different machines
                    </Typography>
                </ListItemContent>
            </AccordionSummary>
            <AccordionDetails>
                <Table borderAxis="none">
                    <thead>
                    <tr>
                        <th style={{width: '30%'}}>Serial Number</th>
                        <th>Path</th>
                        <th style={{width: '5%'}}>Enabled</th>
                        <th style={{width: '5%'}}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        displayData.map((d, i) => (
                            <tr key={i}>
                                <td>
                                    <Input
                                        value={d.displaySerial}
                                        onChange={(e) => {
                                            handleChange(i, "displaySerial", e.target.value || d.displaySerial);
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        value={d.displayPath}
                                        onChange={(e) => {
                                            handleChange(i, "displayPath", e.target.value || d.displaySerial);
                                        }}
                                    />
                                </td>
                                <td>
                                    <Switch
                                        checked={d.displayEnabled}
                                        onChange={(e) => {
                                            handleChange(i, "displayEnabled", e.target.checked);
                                        }}
                                    />
                                </td>
                                <td>
                                    <IconButton variant="outlined" onClick={() => {
                                        handleSaveByIndex(i);
                                    }}>
                                        <SaveIcon/>
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