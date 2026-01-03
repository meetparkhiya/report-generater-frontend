import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import UploadIcon from "@mui/icons-material/CloudUpload";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import TemplateIcon from "@mui/icons-material/Widgets";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        // { text: "Home", icon: <HomeIcon />, path: "/" },
        // { text: "Monthly Report Generator", icon: <UploadIcon />, path: "/upload" },
        // { text: "Template", icon: <TemplateIcon />, path: "/template" },
        // { text: "Process History", icon: <HistoryIcon />, path: "/history" },
        // { text: "Voice Typing", icon: <KeyboardVoiceIcon />, path: "/voice-typing" },
        { text: "Report Genrate", icon: <SettingsIcon />, path: "/report-genrate" },
    ];

    return (
        <Box
            sx={{
                width: 350,
                background: "#fff",
                height: "100vh",
                borderRight: "1px solid #ECEEF2",
                p: 2,
            }}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
}
