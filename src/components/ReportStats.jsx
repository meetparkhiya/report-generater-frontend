import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import {
    Description,
    CheckCircle,
    AccessTime,
    Error,
} from '@mui/icons-material';

const ReportStats = ({ reports = [] }) => {
    const totalReports = reports.length;
    const completedReports = reports.filter(r => r.status === 'completed').length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const failedReports = reports.filter(r => r.status === 'failed').length;

    const stats = [
        {
            label: 'Total Reports',
            value: totalReports,
            icon: Description,
            bgColor: 'rgba(37, 99, 235, 0.1)',
            iconColor: '#2563eb',
        },
        // Uncomment when needed
        // {
        //   label: 'Completed',
        //   value: completedReports,
        //   icon: CheckCircle,
        //   bgColor: 'rgba(16, 185, 129, 0.1)',
        //   iconColor: '#10b981',
        // },
        // {
        //   label: 'Pending',
        //   value: pendingReports,
        //   icon: AccessTime,
        //   bgColor: 'rgba(245, 158, 11, 0.1)',
        //   iconColor: '#f59e0b',
        // },
        // {
        //   label: 'Failed',
        //   value: failedReports,
        //   icon: Error,
        //   bgColor: 'rgba(239, 68, 68, 0.1)',
        //   iconColor: '#ef4444',
        // },
    ];

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',        // mobile
                    sm: 'repeat(2, 1fr)', // tablet
                    lg: 'repeat(4, 1fr)', // desktop
                },
                gap: { xs: 1.5, sm: 2 },
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
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 1.5, sm: 2 },
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: { xs: 40, sm: 48 },
                                    height: { xs: 40, sm: 48 },
                                    bgcolor: stat.bgColor,
                                }}
                            >
                                <stat.icon
                                    sx={{
                                        color: stat.iconColor,
                                        fontSize: { xs: 20, sm: 24 },
                                    }}
                                />
                            </Avatar>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.4rem', sm: '1.75rem' },
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                >
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
