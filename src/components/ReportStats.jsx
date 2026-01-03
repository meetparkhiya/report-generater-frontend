import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import {
    Description,
    CheckCircle,
    AccessTime,
    Error,
} from '@mui/icons-material';

const ReportStats = ({ reports }) => {
    const totalReports = reports.length;
    const completedReports = reports.filter((r) => r.status === 'completed').length;
    const pendingReports = reports.filter((r) => r.status === 'pending').length;
    const failedReports = reports.filter((r) => r.status === 'failed').length;

    const stats = [
        {
            label: 'Total Reports',
            value: totalReports,
            icon: Description,
            bgColor: 'rgba(37, 99, 235, 0.1)',
            iconColor: '#2563eb',
        },
        // {
        //     label: 'Completed',
        //     value: completedReports,
        //     icon: CheckCircle,
        //     bgColor: 'rgba(16, 185, 129, 0.1)',
        //     iconColor: '#10b981',
        // },
        // {
        //     label: 'Pending',
        //     value: pendingReports,
        //     icon: AccessTime,
        //     bgColor: 'rgba(245, 158, 11, 0.1)',
        //     iconColor: '#f59e0b',
        // },
        // {
        //     label: 'Failed',
        //     value: failedReports,
        //     icon: Error,
        //     bgColor: 'rgba(239, 68, 68, 0.1)',
        //     iconColor: '#ef4444',
        // },
    ];

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 2,
            }}
        >
            {stats.map((stat, index) => (
                <Card
                    key={stat.label}
                    sx={{
                        animation: 'fadeIn 0.4s ease-out forwards',
                        animationDelay: `${index * 100}ms`,
                        opacity: 0,
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(8px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}
                >
                    <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: stat.bgColor,
                                }}
                            >
                                <stat.icon sx={{ color: stat.iconColor, fontSize: 24 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default ReportStats;
