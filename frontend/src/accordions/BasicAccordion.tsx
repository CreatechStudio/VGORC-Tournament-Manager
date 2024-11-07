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
import {useState} from "react";
import {PAD} from "../constants.ts";

export default function BasicAccordion({
    disabled
} : {
    disabled?: boolean;
}) {
    const [durationPerMatch, setDurationPerMatch] = useState(60);

    function handleSave() {}

    return (
        <Accordion sx={{width: '100%'}}>
            <AccordionSummary>
                <Avatar color="primary">
                    <TapAndPlayRoundedIcon />
                </Avatar>
                <ListItemContent>
                    <Typography level="title-md">Season Settings</Typography>
                    <Typography level="body-sm">
                        Basic settings for a season
                    </Typography>
                </ListItemContent>
                <Button
                    disabled={disabled}
                    variant="outlined"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                    }}
                >
                    Save
                </Button>
            </AccordionSummary>
            <AccordionDetails sx={{pl: PAD, pr: PAD}}>
                <Table borderAxis="none">
                    <tbody>
                    <tr>
                        <td>
                            <FormControl>
                                <FormLabel>Duration / Match</FormLabel>
                                <FormHelperText>
                                    in second
                                </FormHelperText>
                            </FormControl>
                        </td>
                        <td>
                            <Input
                                variant="soft"
                                value={durationPerMatch}
                                type="number"
                                onChange={(e) => setDurationPerMatch(+e.target.value)}
                                sx={{flexGrow: 1}}
                                disabled
                            />
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}
