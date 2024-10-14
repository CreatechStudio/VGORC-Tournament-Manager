import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Input,
    ListItemContent, Table,
    Typography
} from "@mui/joy";
import EditNotificationsRoundedIcon from '@mui/icons-material/EditNotificationsRounded';
import {useState} from "react";
import {DivisionObject} from "../../common/Division.ts";
import {LARGE_PART, PAD} from "../src/constants.ts";
import ChipInput from "../components/ChipInput.tsx";

export default function TournamentAccordion({
    disabled
} : {
    disabled?: boolean;
}) {
    const [divisions, setDivisions] = useState<DivisionObject[]>([
        {
            divisionName: "Division 1",
            fields: [
                "Field 1",
                "Field 2"
            ]
        },
        {
            divisionName: "Division 2",
            fields: [
                "Field 3",
                "Field 4"
            ]
        }
    ]);

    function handleSetFields(index: number, newFields: string[]) {
        const newDivisions = JSON.parse(JSON.stringify(divisions));
        newDivisions[index].fields = newFields;
        setDivisions(newDivisions);
    }

    function handleSetDivisionName(index: number, newDivisionName: string) {
        const newDivisions = JSON.parse(JSON.stringify(divisions));
        newDivisions[index].divisionName = newDivisionName;
        setDivisions(newDivisions);
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
                <Table borderAxis="xBetween">
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
                    </tr>
                    </thead>
                    <tbody>
                    {
                        divisions.map((d, index) => (
                            <tr key={index}>
                                <td>
                                    <Input
                                        value={d.divisionName}
                                        sx={{maxWidth: `${LARGE_PART}%`, mb: PAD, mt: PAD}}
                                        variant="soft"
                                        disabled={disabled}
                                        onChange={(e) => handleSetDivisionName(index, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <ChipInput chips={d.fields} setChips={(fields) => {
                                        handleSetFields(index, fields);
                                    }} disabled={disabled}/>
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
