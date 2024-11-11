// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {Box, ButtonGroup, Sheet, Table, Typography} from "@mui/joy";
import {LOGO_INTERVAL_NUMBER, PAD, PictureObject, PICTURES, RANK_TABLE_SCROLL_SPEED} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {useEffect, useState} from "react";
import {getReq} from "../net.ts";
import {ChooseDivisionPage} from "./ScorePage.tsx";
import ScrollTable from "../components/ScrollTable.tsx";
import PrintTable from "../components/PrintTable.tsx";

interface RankObject {
    teamNumber: string;
    teamAvgScore: number;
    rank: number;
}

const DIVISION_NAME_KEY = "division";

const HEAD  = [
    "RANK",
    "TEAM NUMBER",
    "NUMBER OF PLAYED",
    "AVERAGE SCORE",
]

export default function RankPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const divisionName = urlParams.get(DIVISION_NAME_KEY);

    const [ranks, setRanks] = useState<RankObject[] | PictureObject[]>([]);
    const [data, setData] = useState<any[][]>([]);

    useEffect(() => {
        handleRefresh();
    }, []);

    useEffect(() => {
        const newData = [];
        for (let i = 0; i < ranks.length; i ++) {
            const r = ranks[i];
            if (!r) continue;
            if (r.url) continue;
            newData.push([
                r.rank || index + 1,
                r.teamNumber,
                r.teamMatchCount,
                r.teamAvgScore
            ]);
        }
        setData(newData);
    }, [ranks, setRanks]);

    function handleRefresh() {
        generateRankList(`/rank/qualification/${divisionName}`).then((res) => {
            setRanks(res);
        });
    }

    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            <Box sx={{
                pl: PAD, pr: PAD, pb: PAD,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Typography level="h1">
                    QUALIFICATION RANKING {divisionName ? `- ${divisionName}` : ""}
                </Typography>
                <ButtonGroup>
                    <PrintTable
                        head={HEAD}
                        body={data}
                        title={`QUALIFICATION RANKING - ${divisionName}`}
                    />
                    <MenuDrawer/>
                </ButtonGroup>
            </Box>
            <Sheet sx={{height: '100%'}}>
                {
                    divisionName === null
                    ? <ChooseDivisionPage
                        divisionNameKey={DIVISION_NAME_KEY}
                        urlPrefix={"#rank"}
                    />
                    : <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        overflowY: "scroll"
                    }}>
                        <Table>
                            <thead>
                            <tr>
                                {
                                    HEAD.map((h, i) => (
                                        <th key={i} style={{textAlign: 'center'}}>
                                            <h1>{h}</h1>
                                        </th>
                                    ))
                                }
                            </tr>
                            </thead>
                        </Table>
                        <ScrollTable
                            onRefresh={handleRefresh}
                        >
                            <Table stickyHeader stickyFooter sx={{p: PAD}}>
                                <tbody>
                                {
                                    ranks.map((r, i) => (
                                        r !== undefined ? (
                                            r.url ? <tr key={i}>
                                                <td colSpan={HEAD.length}>
                                                <Box sx={{
                                                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                                    alignItems: 'center', p: PAD
                                                }}>
                                                    <img src={r.url} alt={r.name} height={100}/>
                                                </Box>
                                            </td>
                                        </tr> : <tr key={i}>
                                            <td>
                                                <Typography level="h2" sx={{textAlign: 'center'}}>
                                                    {r.rank || i + 1}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography level="h2" sx={{textAlign: 'center'}}>
                                                    {r.teamNumber}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography level="h2" sx={{textAlign: 'center'}}>
                                                    {r.teamMatchCount}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography level="h2" sx={{textAlign: 'center'}}>
                                                    {r.teamAvgScore}
                                                </Typography>
                                            </td>
                                        </tr>
                                        ) : <></>))
                                }
                                </tbody>
                            </Table>
                        </ScrollTable>
                        </div>
                }
            </Sheet>
        </Box>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function generateRankList(endpoint: string, solveData?: (data: []) => []) {
    let res = await getReq(endpoint);
    if (solveData) {
        res = solveData(res);
    }
    const newRanks = [];
    let pictureIndex = 0;
    for (let i = 0; i < res.length; i ++) {
        if (i % LOGO_INTERVAL_NUMBER === 0 && i !== 0) {
            newRanks.push(PICTURES[pictureIndex]);
            pictureIndex += 1;
            pictureIndex %= PICTURES.length;
        }
        res[i].rank = i+1;
        newRanks.push(res[i]);
    }
    for (let j = pictureIndex; j <= PICTURES.length; j ++) {
        newRanks.push(PICTURES[j]);
    }
    return newRanks;
}
