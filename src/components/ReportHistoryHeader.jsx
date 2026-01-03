import { Box, Typography, Button, Avatar } from '@mui/material';
import { Description, Add } from '@mui/icons-material';

const ReportHistoryHeader = ({ onGenerateClick }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    sx={{
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        boxShadow: '0 4px 14px -4px rgba(37, 99, 235, 0.4)',
                    }}
                >
                    <Description sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Report History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View and download previously generated reports
                    </Typography>
                </Box>
            </Box>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onGenerateClick}
                sx={{
                    px: 3,
                    py: 1.25,
                }}
            >
                Generate New Report
            </Button>
        </Box>
    );
};

export default ReportHistoryHeader;
