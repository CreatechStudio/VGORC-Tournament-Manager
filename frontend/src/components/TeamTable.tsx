import {Box, Button, ButtonGroup, Input, Table, Typography} from "@mui/joy";
import {useEffect, useState} from "react";
import {TeamObject} from "../../../common/Team.ts";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from '@mui/icons-material/Upload';
import {LARGE_PART, PAD} from "../constants.ts";

export default function TeamTable({
    teams,
    setTeams,
    disabled
} : {
    teams: TeamObject[];
    setTeams: (teams: TeamObject[]) => void;
    disabled?: boolean;
}) {
    const [localTeams, setLocalTeams] = useState<TeamObject[]>(teams || []);

    useEffect(() => {
        setLocalTeams(teams);
    }, [setTeams, teams]);

    function handleNew() {

    }

    function handleSave() {

    }

    function handleSetValue<T>(index: number, filedName: string, newValue: T) {
        const newTeams = JSON.parse(JSON.stringify(localTeams));
        newTeams[index][filedName] = newValue;
        setLocalTeams(newTeams);
    }

    return (
        <Table
            borderAxis="xBetween"
            sx={{
                '& tr > :last-child': {textAlign: 'right'}
            }}
        >
            <thead>
            <tr>
                <td>
                    <Typography level="title-md">
                        Team Number
                    </Typography>
                </td>
                <td>
                    <Typography level="title-md">
                        Name
                    </Typography>
                </td>
                <td>
                    <Typography level="title-md">
                        Organization
                    </Typography>
                </td>
                <td>
                    <Typography level="title-md">
                        Division
                    </Typography>
                </td>
                <td>
                    <Typography level="title-md">
                        Average Score
                    </Typography>
                </td>
                <td>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <ButtonGroup disabled={disabled}>
                            <Button
                                onClick={() => handleNew()}
                                startDecorator={
                                    <AddIcon/>
                                }
                            >
                                New Team
                            </Button>
                            <Button
                                startDecorator={
                                    <UploadIcon/>
                                }
                            >
                                Import from File
                            </Button>
                            <Button
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
                localTeams.map((t, index) => (
                    <tr key={index}>
                        <td>
                            <Input
                                value={t.teamNumber}
                                sx={{maxWidth: `${LARGE_PART}%`, mb: PAD, mt: PAD}}
                                variant="soft"
                                disabled={disabled}
                                placeholder="Team Number"
                                onChange={(e) =>
                                    handleSetValue(index, e.target.value, "teamNumber")
                                }
                            />
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </Table>
    );
}