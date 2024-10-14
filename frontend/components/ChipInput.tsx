import {Box, Button, Chip, ChipDelete, Input} from "@mui/joy";
import {useState} from "react";
import {PAD} from "../src/constants";

export default function ChipInput({
    chips,
    setChips,
    disabled
} : {
    chips: string[],
    setChips: (chips: string[]) => void,
    disabled?: boolean
}) {
    const [chip, setChip] = useState<string>("");

    function handleDeleteIgnore(c: string) {
        c = c.trim();
        if (chips.indexOf(c) !== -1) {
            const newIgnores = JSON.parse(JSON.stringify(chips));
            newIgnores.splice(chips.indexOf(c), 1);
            setChips(newIgnores);
        }
    }

    function handleAddIgnore() {
        let c = chip.trim();
        if (c.length > 0 && chips.indexOf(c) === -1) {
            setChips([...chips, c]);
            setChip("");
        }
    }

    return (
        <Box sx={{
            width: '100%', display: 'flex', flexDirection: 'row', flexGrow: 1,
            justifyContent: 'flex-start', alignItems: 'center',
            flexFlow: 'row wrap', gap: PAD
        }}>
            {
                chips.map((ignore, index) => (
                    <Chip
                        key={index}
                        endDecorator={
                            disabled ? <></> :
                            <ChipDelete onDelete={() => handleDeleteIgnore(ignore)}/>
                        }
                    >
                        {ignore}
                    </Chip>
                ))
            }
            {
                disabled ? <></> :
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleAddIgnore();
                    }} style={{flexGrow: 1}}>
                        <Input
                            sx={{width: '100%'}}
                            value={chip}
                            onChange={(event) => setChip(event.target.value)}
                            endDecorator={
                                <Button variant="soft" color="neutral" type="submit">
                                    Add
                                </Button>
                            }
                        />
                    </form>
            }
        </Box>
    );
}
