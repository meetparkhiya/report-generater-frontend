import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import UploadCard from "../components/UploadCard";
import Template from "../components/Template";
import VoiceTyping from "../components/VoiceTyping";
import ReportGenratePage from "./ReportGenratePage";

export default function Dashboard() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                overflow: "hidden",
            }}
        >
            {/* Sidebar */}
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={handleDrawerToggle}
            />

            {/* Content Area */}
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: "100vh",
                    overflowY: "auto",
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 2, md: 4 },
                }}
            >
                {/* Mobile Menu Button */}
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{
                        display: { md: "none" },
                        mb: 2,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<UploadCard />} />
                    <Route path="/template" element={<Template />} />
                    <Route path="/voice-typing" element={<VoiceTyping />} />
                    <Route path="/report-genrate" element={<ReportGenratePage />} />
                </Routes>
            </Box>
        </Box>
    );
}
