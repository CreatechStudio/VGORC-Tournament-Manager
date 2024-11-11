// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {MutableRefObject, useEffect, useRef, useState} from "react";
import {Box, ButtonGroup, Sheet, Table, Typography} from "@mui/joy";
import {PAD, PictureObject} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {generateRankList} from "./RankPage.tsx";
import ScrollTable from "../components/ScrollTable.tsx";

interface RankObject {
    teamNumber: string;
    DriverScore: number;
    AutoScore: number;
    TotalScore: number;
    rank: number;
}

export default function SkillsRankPage() {
    const [ranks, setRanks] = useState<RankObject[] | PictureObject[]>([]);
    const tableRef: MutableRefObject<HTMLElement | null> = useRef(null);

    useEffect(() => {
        handleRefresh();
    }, []);

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
                    <MenuDrawer/>
                </ButtonGroup>
            </Box>
            <Sheet sx={{height: '100%'}}>
                <Box sx={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    overflowY: "scroll"
                }} ref={tableRef}>
                    <Table>
                        <thead>
                        <tr>
                            <th style={{textAlign: 'center'}}><h1>RANK</h1></th>
                            <th style={{textAlign: 'center'}}><h1>TEAM NUMBER</h1></th>
                            <th style={{textAlign: 'center'}}><h1>DRIVER SCORE</h1></th>
                            <th style={{textAlign: 'center'}}><h1>AUTON SCORE</h1></th>
                            <th style={{textAlign: 'center'}}><h1>TOTAL SCORE</h1></th>
                        </tr>
                        </thead>
                    </Table>
                    <ScrollTable>
                        <Table stickyHeader stickyFooter sx={{p: PAD}}>
                            <tbody>
                            {
                                ranks.map((r, i) => (
                                    r !== undefined ? (
                                        r.url ? <tr key={i}>
                                            <td colSpan={5}>
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
