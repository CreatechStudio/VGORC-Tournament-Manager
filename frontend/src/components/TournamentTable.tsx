import {useEffect, useState} from "react";
import {Box, Button, ButtonGroup, IconButton, Input, Table, Typography} from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import ChipInput from "./ChipInput.tsx";
import {PAD} from "../constants.ts";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {deleteReq, postReq} from "../net.ts";
import toast from "react-hot-toast";
import {includes} from "../../../common/utils.ts";

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

    return (
        <Input
            value={localValue}
            sx={{
                mb: PAD, mt: PAD
            }}
            variant={variant || "soft"}
            disabled={disabled}
            type={type || "text"}
            onChange={(e) => {
                setLocalValue(e.target.value);
            }}
            onBlur={() => {
                setValue(localValue.toString());
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
} : {
    arr: T[];
    setArr: (newArr: T[]) => void;
    defaultValue: T;
    disabled?: boolean;
    getDeleteEndpoint: (obj: T) => string;
    updateEndpoint: string;
}) {
    const TKeys = Object.keys(defaultValue);

    const [localArr, setLocalArr] = useState<T[]>(arr || []);

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
        if (typeof value === "string") {
            return (
                <TableInput
                    value={value}
                    setValue={(v) => setValue(index, objKey, v)}
                    disabled={disabled}
                />
            )
        } else if (typeof value === "number") {
            return (
                <TableInput
                    value={value}
                    setValue={(v) => setValue(index, objKey, parseFloat(v) === 0 ? 0 : (parseFloat(v) || value))}
                    disabled={disabled}
                    type="number"
                />
            )
        } else {
            return (
                <ChipInput chips={value} setChips={(chips) => {
                    setValue(index, objKey, chips);
                }} disabled={disabled}/>
            )
        }
    }

    function handleNew() {
        setLocalArr([
            ...localArr,
            defaultValue
        ]);
    }

    function handleSave() {
        let changeFlag = false;
        let successFlag = true;
        const promises: Promise<unknown>[] = [];
        localArr.forEach((obj) => {
            // 如果本地存在但是远端不存在或与远端的不同，那就更新这条记录
            if (!includes(arr, obj)) {
                changeFlag = true;
                promises.push(postReq(updateEndpoint, {
                    data: obj
                }).then((res) => {
                    setLocalArr(res || localArr);
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
                <th style={{width: '25%'}}>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <ButtonGroup disabled={disabled}>
                            <Button
                                onClick={() => handleNew()}
                                startDecorator={
                                    <AddIcon/>
                                }
                            >
                                New
                            </Button>
                            <Button
                                onClick={() => handleImport()}
                                startDecorator={
                                    <UploadIcon/>
                                }
                            >
                                Import
                            </Button>
                            <Button
                                onClick={() => handleSave()}
                            >
                                Save
                            </Button>
                        </ButtonGroup>
                    </Box>
                </th>
            </tr>
            </thead>
            <tbody>
            {
                localArr.map((obj, i) => (
                    <tr key={i}>
                        {
                            Object.keys(obj).map((key) => (
                                <td key={key}>
                                    <Box sx={{p: PAD}}>
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
            </tbody>
        </Table>
    );
}
