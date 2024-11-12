// @ts-nocheck

import {ReactNode, useEffect, useRef, useState} from "react";
import "./ScrollTable.css";
import {RANK_TABLE_SCROLL_SPEED} from "../constants.ts";

export default function ScrollTable({children, onRefresh} : {
    children: ReactNode;
    onRefresh: () => void;
}) {
    const tableRef1 = useRef<HTMLDivElement>(null);
    const tableRef2 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (tableRef1.current && tableRef2.current) {
            const height = tableRef1.current.scrollHeight;
            const duration = height / RANK_TABLE_SCROLL_SPEED;
            tableRef1.current.style.setProperty("--scroll-period", `${duration}ms`);
            tableRef2.current.style.setProperty("--scroll-period", `${duration}ms`);
            setTimeout(() => {
                onRefresh();
            }, duration);
        }
    }, [children]);

    return (
        <div className="scroll-table">
            <div className="ctx" ref={tableRef1}>
                {children}
            </div>
            <div className="ctx" ref={tableRef2}>
                {children}
            </div>
        </div>
    );
}
