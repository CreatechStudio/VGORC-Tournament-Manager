// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {useEffect, useState} from "react";
import {Box, ButtonGroup, Sheet, Table, Typography} from "@mui/joy";
import {PAD, PictureObject} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {generateRankList} from "./RankPage.tsx";
import ScrollTable from "../components/ScrollTable.tsx";
import PrintTable from "../components/PrintTable.tsx";

interface RankObject {
    teamNumber: string;
    DriverScore: number;
    AutoScore: number;
    TotalScore: number;
    rank: number;
}

const HEAD = [
    "RANK",
    "TEAM NUMBER",
    "DRIVER SCORE",
    "AUTON SCORE",
    "TOTAL SCORE"
];

export default function SkillsRankPage() {
    const [ranks, setRanks] = useState<RankObject[] | PictureObject[]>([]);
    const [data, setData] = useState<any[][]>([]);

    useEffect(() => {
        document.title = "VGORC TM | Skills Ranking";
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
                r.DriverScore,
                r.AutoScore,
                r.TotalScore
            ]);
        }
        setData(newData);
    }, [ranks, setRanks]);

    function handleRefresh() {
        generateRankList(`/rank/skill`).then((res) => {
            setRanks(res);
        }).catch();
    }

    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            <Box sx={{
                pl: PAD, pr: PAD, pb: PAD,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Typography level="h1">
                    SKILLS RANKING
                </Typography>
                <ButtonGroup>
                    <PrintTable
                        head={HEAD}
                        body={data}
                        title="SKILLS RANKING"
                    />
                    <MenuDrawer/>
                </ButtonGroup>
            </Box>
            <Sheet sx={{height: '100%'}}>
                <Box sx={{
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
                                                    {r.rank || i+1}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography level="h2" sx={{textAlign: 'center'}}>
                                                    {r.teamNumber}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography level="h2" sx={{textAlign: 'center'}}>
                                                    {r.DriverScore}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography level="h2" sx={{textAlign: 'center'}}>
                                                    {r.AutoScore}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography level="h2" sx={{textAlign: 'center'}}>
                                                    {r.TotalScore}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ) : <></>
                                ))
                            }
                            </tbody>
                        </Table>
                    </ScrollTable>
                </Box>
            </Sheet>
        </Box>
    );
}
