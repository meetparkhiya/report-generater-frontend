import { Box, Typography, Avatar } from "@mui/material";
import { FolderOff } from "@mui/icons-material";
import ReportCard from "./ReportCard";

const ReportList = ({ reports }) => {

    if (!reports || reports.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    px: { xs: 2, sm: 4 },
                    py: { xs: 4, sm: 6 },
                    boxShadow: 2,
                    textAlign: "center",
                }}
            >
                <Avatar
                    sx={{
                        width: { xs: 56, sm: 72 },
                        height: { xs: 56, sm: 72 },
                        bgcolor: "action.hover",
                        mb: 2,
                    }}
                >
                    <FolderOff
                        sx={{
                            fontSize: { xs: 28, sm: 36 },
                            color: "text.secondary",
                        }}
                    />
                </Avatar>

                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        mb: 0.5,
                    }}
                >
                    No Reports Found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 420 }}
                >
                    No reports match your current filters. Try adjusting your
                    search or filter criteria.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2 },
                width: "100%",
            }}
        >
            {reports.map((report, index) => (
                <ReportCard
                    key={report._id || index}
                    report={report}
                    index={index}
                />
            ))}
        </Box>
    );
};

export default ReportList;
