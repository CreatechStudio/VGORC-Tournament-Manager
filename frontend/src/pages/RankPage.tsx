// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {Box, ButtonGroup, Sheet, Table, Typography} from "@mui/joy";
import {LOGO_INTERVAL_NUMBER, PAD, PictureObject, PICTURES, RANK_TABLE_SCROLL_SPEED} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {getReq} from "../net.ts";
import {ChooseDivisionPage} from "./ScorePage.tsx";

interface RankObject {
    teamNumber: string;
    teamAvgScore: number;
    rank: number;
}

const DIVISION_NAME_KEY = "division";

export default function RankPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const divisionName = urlParams.get(DIVISION_NAME_KEY);

    const [ranks, setRanks] = useState<RankObject[] | PictureObject[]>([]);
    const tableRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

    useEffect(() => {
        handleRefresh();
    }, []);

    function handleRefresh() {
        generateRankList(`/rank/qualification/${divisionName}`).then((res) => {
            setRanks(res);
            rankTableScrollStep(tableRef, handleRefresh);
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
                    }} ref={tableRef}>
                        <Table stickyHeader stickyFooter sx={{p: PAD}}>
                            <thead>
                            <tr>
                                <th style={{textAlign: 'center'}}><h1>RANK</h1></th>
                                <th style={{textAlign: 'center'}}><h1>TEAM NUMBER</h1></th>
                                <th style={{textAlign: 'center'}}><h1>AVERAGE SCORE</h1></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                ranks.map((r, i) => (
                                    r !== undefined ? (
                                        r.url ? <tr key={i}>
                                            <td colSpan={3}>
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
                                                    {r.teamAvgScore}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ) : <></>
                                ))
                            }
                            </tbody>
                            <tfoot>
                            <tr>
                                {/*占位*/}
                                <td colSpan={3} style={{textAlign: 'center'}}></td>
                            </tr>
                            </tfoot>
                        </Table>
                    </div>
                }
            </Sheet>
        </Box>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function rankTableScrollStep(
    tableRef: MutableRefObject<HTMLElement | null>,
    handleRefresh: () => void,
    startTime?: number
) {
    const cur = new Date().getTime();
    if (startTime === undefined) {
        startTime = cur;
    }
    const timeEscaped = cur - startTime;
    try {
        if (tableRef.current) {
            const offsetTop = RANK_TABLE_SCROLL_SPEED * timeEscaped;
            const totalHeight = (tableRef.current.scrollHeight - tableRef.current.querySelector('thead').clientHeight) / 3;
            if (offsetTop >= totalHeight) {
                handleRefresh();
                tableRef.current.scrollTo({
                    left: 0,
                    top: -RANK_TABLE_SCROLL_SPEED,
                    behavior: 'instant'
                });
                startTime = cur;
            } else {
                tableRef.current.scrollTo({
                    left: 0,
                    top: offsetTop
                });
            }
        }
    } catch (e) {
        console.error(e);
    }

    requestAnimationFrame(() => {
        rankTableScrollStep(tableRef, handleRefresh, startTime);
    })
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
    return [...newRanks, ...newRanks, ...newRanks];
}
