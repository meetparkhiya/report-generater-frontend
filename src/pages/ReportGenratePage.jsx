import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import ReportHistoryHeader from '../components/ReportHistoryHeader';
import ReportStats from '../components/ReportStats';
import ReportFilters from '../components/ReportFilters';
import ReportList from '../components/ReportList';
import GenerateReportModal from '../components/GenerateReportModal';


const ReportGenratePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reports, setReports] = useState([]);


    const fetchReportList = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/reports`, {
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.json();
            setReports(data?.reports)
        }

    }

    useEffect(() => {
        fetchReportList()
    }, [])

    // {
    //     "_id": "6950b24f94ba16c0d2b2b892",
    //     "employeeName": "Meet Parkhiya",
    //     "month": "December",
    //     "year": 2025,
    //     "report_file": "uploads\\Meet_Parkhiya\\December_2025\\Meet_Parkhiya_December_2025_2025-12-28.docx",
    //     "fileName": "Meet_Parkhiya_December_2025_2025-12-28.docx",
    //     "fileSize": 168423,
    //     "createdAt": "2025-12-28T04:30:07.697Z",
    //     "updatedAt": "2025-12-28T04:30:07.697Z",
    //     "__v": 0
    // }

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const employeeName = report.employeeName?.toLowerCase() || "";
            const month = report.month?.toLowerCase() || "";

            const search = searchQuery.toLowerCase();

            return (
                employeeName.includes(search) ||
                month.includes(search)
            );
        });
    }, [reports, searchQuery]);


    return (
        // <ThemeProvider >
        <>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    py: 4,
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <ReportHistoryHeader onGenerateClick={() => setIsModalOpen(true)} />
                        <ReportStats reports={filteredReports} />
                        <ReportFilters
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                        />
                        <ReportList reports={filteredReports} />
                    </Box>
                </Container>
            </Box>

            <GenerateReportModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fetchReportList={fetchReportList}
            />
        </>
        // </ThemeProvider> 
    );
};

export default ReportGenratePage;
