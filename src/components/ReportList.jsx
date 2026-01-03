import { Box, Typography, Avatar } from '@mui/material';
import { FolderOff } from '@mui/icons-material';
import ReportCard from './ReportCard';

const ReportList = ({ reports }) => {

    if (reports.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    p: 8,
                    boxShadow: 3,
                }}
            >
                <Avatar
                    sx={{
                        width: 72,
                        height: 72,
                        bgcolor: 'action.hover',
                        mb: 2,
                    }}
                >
                    <FolderOff sx={{ fontSize: 36, color: 'text.secondary' }} />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                    No Reports Found
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    No reports match your current filters. Try adjusting your search or filter criteria.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {reports.map((report, index) => (
                <ReportCard key={report.id} report={report} index={index} />
            ))}
        </Box>
    );
};

export default ReportList;
