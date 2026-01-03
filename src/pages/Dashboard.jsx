import { Box, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";
import UploadCard from "../components/UploadCard";
import StatusBox from "../components/StatusBox";
import { useState } from "react";
import { generateWord } from "../api/processApi";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Template from "../components/Template";
import VoiceTyping from "../components/VoiceTyping";
import ReportGenratePage from "./ReportGenratePage";

export default function Dashboard() {
    const [excel, setExcel] = useState(null);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!excel || !template) return alert("Please upload both files!");

        setLoading(true);

        const res = await generateWord(excel, template);

        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.docx";
        a.click();

        setLoading(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                overflow: "hidden"
            }}
        >
            {/* Sticky Sidebar */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                }}
            >
                <Sidebar />
            </Box>

            {/* Scrollable Content Area */}
            <Box
                sx={{
                    flexGrow: 1,
                    height: "100vh",
                    overflowY: "auto", // Enable vertical scroll
                    p: 4
                }}
            >

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<UploadCard />} />
                    <Route path="/template" element={<Template />} />
                    {/* <Route path="/history" element={<VoiceTyping />} /> */}
                    <Route path="/voice-typing" element={<VoiceTyping />} />
                    <Route path="/report-genrate" element={<ReportGenratePage />} />
                </Routes>
            </Box>
        </Box>
    );
}