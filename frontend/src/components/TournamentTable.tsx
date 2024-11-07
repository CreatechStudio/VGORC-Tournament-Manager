import {useEffect, useState} from "react";
import {Box, ButtonGroup, IconButton, Input, Sheet, Switch, Table, Typography} from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import ChipInput from "./ChipInput.tsx";
import {PAD, SMALL_PART} from "../constants.ts";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {deleteReq, postReq} from "../net.ts";
import toast from "react-hot-toast";
import {includes} from "../../../common/utils.ts";
import SaveIcon from '@mui/icons-material/Save';
import UploadCsvModal from "./UploadCsvModal.tsx";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const DateAttributeNames = [
    "periodStartTime",
    "periodEndTime",
]

function TableInput({
    value,
    setValue,
    disabled,
    variant,
    type
} : {
    value: string | number,
    setValue: (value: string) => void,
    disabled?: boolean,
    variant?: 'plain' | 'outlined' | 'soft' | 'solid',
    type?: string
}) {
    const [localValue, setLocalValue] = useState(value);

    const isDate = type && type.includes("date");

    return (
        <Input
            value={localValue}
            sx={{
                mb: PAD, mt: PAD, minWidth: isDate ? `${SMALL_PART/3}vw` : 0
            }}
            variant={variant || "soft"}
            disabled={disabled}
            type={type || "text"}
            onChange={(e) => {
                setLocalValue(e.target.value);
            }}
            onBlur={(e) => {
                setValue(e.target.value);
            }}
        />
    );
}

export default function TournamentTable<T extends Record<keyof T, string | string[] | number>>({
    arr,
    setArr,
    defaultValue,
    disabled,
    getDeleteEndpoint,
    updateEndpoint,
    allowUpload,
    title
} : {
    arr: T[];
    setArr: (newArr: T[]) => void;
    defaultValue: T;
    disabled?: boolean;
    getDeleteEndpoint: (obj: T) => string;
    updateEndpoint: string;
    allowUpload?: boolean;
    title: string;
}) {
    const TKeys = Object.keys(defaultValue);

    const [localArr, setLocalArr] = useState<T[]>(arr || []);
    const [openModal, setOpenModal] = useState(false);
    const [collaped, setCollaped] = useState(true);

    useEffect(() => {
        setLocalArr(arr);
    }, [setArr, arr]);

    function setValue<V>(index: number, key: string, value: V) {
        const newArr = JSON.parse(JSON.stringify(localArr));
        newArr[index][key] = value;
        setLocalArr(newArr);
    }

    function ValuePresent({obj, index, objKey} : {
        obj: T,
        index: number,
        objKey: string
    }) {
        // @ts-expect-error get value of an object using key
        const value = obj[objKey];
        if (DateAttributeNames.includes(objKey)) {
            return (
                <TableInput
                    value={value}
                    setValue={(t: string) => {
                        setValue(index, objKey, t);
                    }}
                    disabled={disabled}
                    type="datetime-local"
                />
            );
        } else if (typeof value === "boolean") {
            return (
                <Switch
                    checked={value}
                    disabled={disabled}
                    onChange={(e) => {
                        setValue(index, objKey, e.target.checked);
                    }}
                    size="lg"
                    variant="outlined"
                />
            );
        } else if (typeof value === "string") {
            return (
                <TableInput
                    value={value}
                    setValue={(v) => setValue(index, objKey, v)}
                    disabled={disabled}
                />
            );
        } else if (typeof value === "number") {
            return (
                <TableInput
                    value={value}
                    setValue={(v) => setValue(index, objKey, parseFloat(v) === 0 ? 0 : (parseFloat(v) || value))}
                    disabled={disabled}
                    type="number"
                />
            );
        } else {
            return (
                <ChipInput chips={value} setChips={(chips) => {
                    setValue(index, objKey, chips);
                }} disabled={disabled}/>
            );
        }
    }

    function handleNew() {
        setLocalArr([
            ...localArr,
            defaultValue
        ]);
    }

    function handleSave(data?: T[]) {
        const newArr = data || localArr;
        let changeFlag = false;
        let successFlag = true;
        const promises: Promise<unknown>[] = [];
        newArr.forEach((obj) => {
            // 如果本地存在但是远端不存在或与远端的不同，那就更新这条记录
            if (!includes(arr, obj)) {
                changeFlag = true;
                promises.push(postReq(updateEndpoint, {
                    data: obj
                }).then((res) => {
                    setLocalArr(res || newArr);
                    setArr(res || arr);
                }).catch(() => {
                    successFlag = false;
                }));
            }
        });
        Promise.all(promises).then(() => {
            if (!changeFlag) {
                setLocalArr(arr);
            }
            if (successFlag) {
                toast.success("Save successfully");
            }
        });
    }

    function handleImport() {
        setOpenModal(true);
    }

    function handleDelete(index: number) {
        const obj = localArr[index];
        if (includes(arr, obj)) {
            deleteReq(getDeleteEndpoint(obj)).then((res) => {
                setArr(res || arr);
                const newArr = JSON.parse(JSON.stringify(localArr));
                newArr.splice(index, 1);
                setLocalArr(newArr);
                toast.success("Delete successfully");
            });
        } else {
            const newArr = JSON.parse(JSON.stringify(localArr));
            newArr.splice(index, 1);
            setLocalArr(newArr);
        }
    }

    return (
        <Sheet sx={{p: PAD / 2}}>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: PAD}}>
                <IconButton onClick={() => setCollaped(!collaped)}>
                    {
                        collaped ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>
                    }
                </IconButton>
                <Typography level="title-lg">
                    {title}
                </Typography>
            </Box>
            {
                collaped ? <></> : (
                    <Table
                        sx={{
                            '& tr > :last-child': { textAlign: 'right' }
                        }}
                    >
                        <thead>
                        <tr>
                            {
                                TKeys.map((key, index) => (
                                    <th key={index}>
                                        <Typography sx={{pl: PAD}}>
                                            {key}
                                        </Typography>
                                    </th>
                                ))
                            }
                            <th style={{width: '10%'}}>
                                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                    <ButtonGroup disabled={disabled}>
                                        <IconButton
                                            onClick={() => handleNew()}
                                        >
                                            <AddIcon/>
                                        </IconButton>
                                        {
                                            allowUpload ?
                                                <IconButton
                                                    onClick={() => handleImport()}
                                                >
                                                    <UploadIcon/>
                                                </IconButton> : <></>
                                        }
                                        <IconButton
                                            onClick={() => handleSave()}
                                        >
                                            <SaveIcon/>
                                        </IconButton>
                                    </ButtonGroup>
                                </Box>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            localArr.length === 0 ? (
                                <tr style={{padding: PAD}}>
                                    <td colSpan={TKeys.length + 1}>
                                        <Typography level="title-lg" sx={{width: '100%', textAlign: 'center'}}>
                                            Nothing Here... 🥵
                                        </Typography>
                                    </td>
                                </tr>
                            ) : <>
                            {
                                localArr.map((obj, i) => (
                                    <tr key={i}>
                                        {
                                            Object.keys(obj).map((key) => (
                                                <td key={key}>
                                                    <Box sx={{p: PAD, width: '100%'}}>
                                                        <ValuePresent obj={obj} index={i} objKey={key}/>
                                                    </Box>
                                                </td>
                                            ))
                                        }
                                        <td>
                                            <IconButton onClick={() => handleDelete(i)} disabled={disabled}>
                                                <DeleteOutlineIcon/>
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))
                            }
                            </>
                        }
                        </tbody>
                        <UploadCsvModal
                            open={openModal}
                            setOpen={setOpenModal}
                            header={TKeys}
                            onSubmit={async (value) => {
                                setLocalArr(value);
                                handleSave(value);
                            }}
                        />
                    </Table>
                )
            }
        </Sheet>
    );
}
