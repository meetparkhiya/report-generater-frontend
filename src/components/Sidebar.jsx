import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 300;

export default function Sidebar({ mobileOpen, onClose }) {
    const location = useLocation();

    const menuItems = [
        {
            text: "Report Generate",
            icon: <SettingsIcon />,
            path: "/report-genrate",
        },
    ];

    const sidebarContent = (
        <Box
            sx={{
                width: drawerWidth,
                height: "100%",
                bgcolor: "#fff",
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
                        onClick={onClose}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <Box
                sx={{
                    display: { xs: "none", md: "block" },
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                }}
            >
                {sidebarContent}
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        </>
    );
}
