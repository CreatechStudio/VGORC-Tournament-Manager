// @ts-nocheck

import {Box, ButtonGroup, Sheet, Table, Typography} from "@mui/joy";
import {DIVISION_NAME_KEY, PAD, PAD2, PictureObject} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {ChooseDivisionPage} from "./ScorePage.tsx";
import {useEffect, useState} from "react";
import {MatchObject} from "../../../common/Match.ts";
import {generateRankList} from "./RankPage.tsx";
import {PeriodObject} from "../../../common/Period.ts";
import {getReq} from "../net.ts";
import ScrollTable from "../components/ScrollTable.tsx";
import PrintTable from "../components/PrintTable.tsx";

const HEAD = [
    "Match Number",
    "Team",
    "Start Time",
    "Field Name"
];

export default function SchedulePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const divisionName = urlParams.get(DIVISION_NAME_KEY);

    const [schedules, setSchedules] = useState<MatchObject[] | PictureObject[]>([]);
    const [periods, setPeriods] = useState<PeriodObject[]>([]);
    const [data, setData] = useState<any[][]>([]);

    useEffect(() => {
        document.title = `VGORC TM | ${divisionName ? `Schedule ${divisionName}` : "Select Division"}`;
        if (divisionName) {
            handleRefreshSchedule();
        }
    }, []);

    useEffect(() => {
        const newData = [];
        for (let i = 0; i < schedules.length; i ++) {
            const r = schedules[i];
            if (!r) continue;
            if (r.url) continue;
            newData.push([
                `${r.matchType[0].toUpperCase()}${r.matchNumber}`,
                r.matchTeam.join(', '),
                getStartTime(r) || "",
                r.matchField
            ]);
        }
        setData(newData);
    }, [schedules, setSchedules]);

    function handleRefreshSchedule() {
        getReq('/period').then((res) => {
            setPeriods(res);
            generateRankList(`/schedule/${divisionName}`, (data) => {
                const newSchedule: MatchObject[] = [];
                data.forEach((item) => {
                    item.matches.forEach((d: MatchObject) => {
                        if (!d.hasScore) {
                            newSchedule.push(d);
                        }
                    });
                });
                return newSchedule;
            }).then((res) => {
                setSchedules(res);
                rankTableScrollStep(tableRef, handleRefreshSchedule);
            });
        }).catch();
    }

    function getPeriod(matchObject: MatchObject) {
        for (let i = 0; i < periods.length; i ++) {
            if (periods[i].periodNumber === matchObject.matchPeriod) {
                return periods[i];
            }
        }
    }

    function getStartTime(matchObject: MatchObject) {
        if (matchObject.matchType === "Elimination") {
            return "";
        }
        const period = getPeriod(matchObject);
        if (period) {
            let startTime = new Date(period.periodStartTime).getTime();
            startTime += period.periodMatchDuration * 60 * 1000 * matchObject.matchCountInPeriod;
            return new Date(startTime).toLocaleTimeString();
        }
    }

    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            <Box sx={{
                pl: PAD, pr: PAD, pb: PAD,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Typography level="h1">
                    SCHEDULE {divisionName ? `- ${divisionName}` : ""}
                </Typography>
                <ButtonGroup>
                    <PrintTable
                        head={HEAD}
                        body={data}
                        title={`SCHEDULE - ${divisionName}`}
                    />
                    <MenuDrawer/>
                </ButtonGroup>
            </Box>
            <Sheet sx={{height: '100%'}}>
                {
                    divisionName === null
                        ? <ChooseDivisionPage
                            divisionNameKey={DIVISION_NAME_KEY}
                            urlPrefix={"#schedule"}
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
                                onRefresh={handleRefreshSchedule}
                            >
                                <Table stickyHeader stickyFooter sx={{p: PAD}}>
                                    <tbody>
                                    {
                                        schedules.map((r, i) => (
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
                                                </tr> : r.hasScore ? <></> : <tr key={i}>
                                                    <td>
                                                        <Typography level="h2" sx={{textAlign: 'center'}}>
                                                            {r.matchType[0].toUpperCase()}{r.matchNumber}
                                                        </Typography>
                                                    </td>
                                                    <td>
                                                        <Box sx={{
                                                            display: 'flex', flexDirection: 'row',
                                                            justifyContent: 'center', alignItems: 'center',
                                                            gap: PAD2
                                                        }}>
                                                            {
                                                                r.matchTeam.map((team, index) => (
                                                                    <Typography key={index} level="h2" sx={{textAlign: 'center'}}>
                                                                        {team}
                                                                    </Typography>
                                                                ))
                                                            }
                                                        </Box>
                                                    </td>
                                                    <td>
                                                        <Typography level="h2" sx={{textAlign: 'center'}}>
                                                            {getStartTime(r) || ""}
                                                        </Typography>
                                                    </td>
                                                    <td>
                                                        <Typography level="h2" sx={{textAlign: 'center'}}>
                                                            {r.matchField}
                                                        </Typography>
                                                    </td>
                                                </tr>
                                            ) : <></>
                                        ))
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
