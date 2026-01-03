import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Avatar,
    Tooltip,
} from '@mui/material';
import {
    Download,
    Description,
    Person,
    CalendarToday,
    Storage,
} from '@mui/icons-material';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const typeColors = {
    Sales: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
    Inventory: { bg: 'rgba(249, 115, 22, 0.1)', color: '#f97316' },
    Financial: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' },
    Analytics: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
    Custom: { bg: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' },
};

const statusConfig = {
    completed: { label: 'Completed', color: 'success' },
    pending: { label: 'Pending', color: 'warning' },
    failed: { label: 'Failed', color: 'error' },
};

const ReportCard = ({ report, index }) => {
    const handleDownload = async (filePath) => {
        try {
            // Windows \ → URL /
            const formattedPath = filePath.replace(/\\/g, "/");

            const fileUrl = `http://localhost:5000/${formattedPath}`;

            const response = await fetch(fileUrl);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = `${report.employeeName}_${report.month}_${report.year}_report.docx`;

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };


    const typeStyle = typeColors[report.reportType];
    const statusStyle = statusConfig[report.status];

    return (
        <Card
            sx={{
                animation: 'fadeIn 0.4s ease-out forwards',
                animationDelay: `${index * 50}ms`,
                opacity: 0,
                transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(8px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
                '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'rgba(37, 99, 235, 0.1)',
                                color: 'primary.main',
                                transition: 'all 0.3s ease',
                                '.MuiCard-root:hover &': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                },
                            }}
                        >
                            <Description />
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {report.employeeName + " " + report?.month + " " + report?.year}
                                </Typography>

                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: 2,
                                    color: 'text.secondary',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Person sx={{ fontSize: 16 }} />
                                    <Typography variant="body2">{report.employeeName}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarToday sx={{ fontSize: 16 }} />
                                    <Typography variant="body2">
                                        {format(report.createdAt, 'MMM dd, yyyy • hh:mm a')}
                                    </Typography>
                                </Box>
                                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Storage sx={{ fontSize: 16 }} />
                                    <Typography variant="body2">{report.fileSize}</Typography>
                                </Box> */}
                            </Box>
                        </Box>
                    </Box>

                    {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>

                        <Tooltip title={'Download Report'}>
                            <span>
                                <IconButton
                                    onClick={() => {
                                        handleDownload(report?.fileName)
                                    }}
                                    disabled={report.status !== 'completed'}
                                    sx={{
                                        bgcolor: report.status === 'completed' ? 'primary.main' : 'action.disabledBackground',
                                        color: report.status === 'completed' ? 'primary.contrastText' : 'action.disabled',
                                        '&:hover': {
                                            bgcolor: report.status === 'completed' ? 'primary.dark' : 'action.disabledBackground',
                                        },
                                    }}
                                >
                                    <Download />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box> */}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReportCard;
