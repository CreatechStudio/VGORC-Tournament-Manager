import {Box, ButtonGroup, Sheet, Table, Typography} from "@mui/joy";
import {PAD} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {getReq} from "../net.ts";

interface RankObject {
    teamNumber: string;
    teamAvgScore: number;
    rank: number;
}

interface PictureObject {
    url: string;
    name: string;
}

const PICTURES: PictureObject[] = [
    {
        url: import.meta.env.VITE_VENDOR_LOGO,
        name: "Vendor Logo"
    },
    {
        url: "/CreatechStudio.png",
        name: "CreatechStudio"
    },
    {
        url: "/VEX GO Logo_Full Color.png",
        name: "VEX GO"
    }
];

const SCROLL_SPEED = .3;

export default function RankPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const divisionName = urlParams.get("division");

    const [ranks, setRanks] = useState<RankObject[] | PictureObject[]>([]);
    const tableRef: MutableRefObject<HTMLElement | null> = useRef(null);

    useEffect(() => {
        handleRefresh();
        requestAnimationFrame(step);
    }, []);

    let tableOffsetTop = 0;

    function step() {
        try {
            if (tableRef.current) {
                tableOffsetTop += SCROLL_SPEED;
                const totalHeight = tableRef.current.scrollHeight - tableRef.current.clientHeight;
                tableRef.current.scrollTo({
                    left: 0,
                    top: tableOffsetTop,
                    behavior: "smooth",
                });
                if (tableOffsetTop > totalHeight) {
                    tableOffsetTop = -SCROLL_SPEED;
                    handleRefresh();
                }
            }
        } catch (e) {
            console.log(e);
        }
        requestAnimationFrame(step);
    }

    function handleRefresh() {
        getReq(`/rank/qualification/${divisionName}`).then((res) => {
            const newRanks = [];
            let pictureIndex = 0;
            for (let i = 0; i < res.length; i ++) {
                if (i % 40 === 0 && i !== 0) {
                    newRanks.push(PICTURES[pictureIndex]);
                    pictureIndex += 1;
                }
                res[i].rank = i+1;
                newRanks.push(res[i]);
            }
            for (let j = pictureIndex; j <= PICTURES.length; j ++) {
                newRanks.push(PICTURES[j]);
            }
            setRanks(newRanks);
        }).catch();
    }

    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            <Box sx={{
                pl: PAD, pr: PAD, pb: PAD,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Typography level="title-lg">
                    Ranking
                </Typography>
                <ButtonGroup>
                    <MenuDrawer/>
                </ButtonGroup>
            </Box>
            <Sheet sx={{height: '100%'}}>
                {
                    divisionName === null
                    ? <Typography sx={{width: '100%', textAlign: 'center'}}>
                        Division name not exist.
                        Use /rank?division={"{divisionName}"} to set.
                    </Typography>
                    : <Box sx={{
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
                                <td colSpan={3} style={{textAlign: 'center'}}>End</td>
                            </tr>
                            </tfoot>
                        </Table>
                    </Box>
                }
            </Sheet>
        </Box>
    );
}
