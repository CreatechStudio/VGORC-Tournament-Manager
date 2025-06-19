// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {Box, ButtonGroup, Sheet, Table, Typography} from "@mui/joy";
import {
    DIVISION_NAME_KEY,
    LOGO_INTERVAL_NUMBER,
    PAD,
    PAD2,
    PictureObject,
    PICTURES,
} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {useEffect, useState} from "react";
import {getReq} from "../net.ts";
import {ChooseDivisionPage} from "./ScorePage.tsx";
import ScrollTable from "../components/ScrollTable.tsx";
import PrintTable from "../components/PrintTable.tsx";

interface QRankObject {
    teamNumber: string;
    teamAvgScore: number;
    rank: number;
}

interface ERankObject {
    score: number;
    teams: string[];
    rank: number;
}

const Q_HEAD  = [
    "RANK",
    "TEAM NUMBER",
    "NUMBER OF PLAYED",
    "AVERAGE SCORE",
]

const E_HEAD  = [
    "RANK",
    "TEAM NUMBER",
    "SCORE",
]

export function QualificationRankPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const divisionName = urlParams.get(DIVISION_NAME_KEY);

    const [ranks, setRanks] = useState<QRankObject[] | PictureObject[]>([]);
    const [data, setData] = useState<never[][]>([]);

    useEffect(() => {
        if (divisionName) {
            handleRefresh();
        }
    }, []);

    useEffect(() => {
        document.title = `VGORC TM | ${divisionName ? `Q Ranking ${divisionName}` : "Select Division"}`;
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
                        head={Q_HEAD}
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
                            urlPrefix={"#qrank"}
                        />
                        : <div style={{
                            height: '100%', display: 'flex', flexDirection: 'column',
                            overflowY: "scroll"
                        }}>
                            <Table>
                                <thead>
                                <tr>
                                    {
                                        Q_HEAD.map((h, i) => (
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
                                                    <td colSpan={Q_HEAD.length}>
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

export function EliminationRankPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const divisionName = urlParams.get(DIVISION_NAME_KEY);

    const [ranks, setRanks] = useState<ERankObject[] | PictureObject[]>([]);
    const [data, setData] = useState<never[][]>([]);

    useEffect(() => {
        if (divisionName) {
            handleRefresh();
        }
    }, []);

    useEffect(() => {
        document.title = `VGORC TM | ${divisionName ? `E Ranking ${divisionName}` : "Select Division"}`;
        const newData = [];
        for (let i = 0; i < ranks.length; i ++) {
            const r = ranks[i];
            if (!r) continue;
            if (r.url) continue;
            newData.push([
                r.rank,
                r.teams.join(', '),
                r.score
            ]);
        }
        setData(newData);
    }, [ranks, setRanks]);

    function handleRefresh() {
        generateRankList(`/rank/elimination/${divisionName}`).then((res) => {
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
                    ELIMINATION RANKING {divisionName ? `- ${divisionName}` : ""}
                </Typography>
                <ButtonGroup>
                    <PrintTable
                        head={E_HEAD}
                        body={data}
                        title={`ELIMINATION RANKING - ${divisionName}`}
                    />
                    <MenuDrawer/>
                </ButtonGroup>
            </Box>
            <Sheet sx={{height: '100%'}}>
                {
                    divisionName === null
                        ? <ChooseDivisionPage
                            divisionNameKey={DIVISION_NAME_KEY}
                            urlPrefix={"#erank"}
                        />
                        : <div style={{
                            height: '100%', display: 'flex', flexDirection: 'column',
                            overflowY: "scroll"
                        }}>
                            <Table>
                                <thead>
                                <tr>
                                    {
                                        E_HEAD.map((h, i) => (
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
                                                    <td colSpan={E_HEAD.length}>
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
                                                            {r.rank}
                                                        </Typography>
                                                    </td>
                                                    <td>
                                                        <Box sx={{
                                                            display: 'flex', flexDirection: 'row',
                                                            justifyContent: 'center', alignItems: 'center',
                                                            gap: PAD2
                                                        }}>
                                                            {
                                                                r.teams.map((team, index) => (
                                                                    <Typography key={index} level="h2"
                                                                                sx={{textAlign: 'center'}}>
                                                                        {team}
                                                                    </Typography>
                                                                ))
                                                            }
                                                        </Box>
                                                    </td>
                                                    <td>
                                                        <Typography level="h2" sx={{textAlign: 'center'}}>
                                                            {r.score}
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
    let res = [];
    try {
        res = await getReq(endpoint);
    } catch {
        res = [];
    }
    if (solveData) {
        res = solveData(res);
    }
    const newRanks = [];
    let pictureIndex = 0;
    for (let i = 0; i < res.length; i++) {
        if (i % LOGO_INTERVAL_NUMBER === 0 && i !== 0) {
            newRanks.push(PICTURES[pictureIndex]);
            pictureIndex += 1;
            pictureIndex %= PICTURES.length;
        }
        res[i].rank = res[i].rank || i + 1;
        newRanks.push(res[i]);
    }
    for (let j = pictureIndex; j <= PICTURES.length; j++) {
        newRanks.push(PICTURES[j]);
    }
    return newRanks;
}