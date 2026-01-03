import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Alert,
    Container,
    Card,
    CardContent,
    MenuItem,
    Grid,
    Stack,
    Avatar,
    CircularProgress,
    Chip,
    Paper,
    Divider
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import * as XLSX from "xlsx";

export default function ExcelToWordApp() {
    const currentMonth = new Date().getMonth() + 1;

    const [sheetLink, setSheetLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [allSheetData, setAllSheetData] = useState({});
    const [employeeName, setEmployeeName] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(String(currentMonth));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [missingDates, setMissingDates] = useState([]);

    const formatDate = (date) => {
        const d = ("0" + date.getDate()).slice(-2);
        const m = ("0" + (date.getMonth() + 1)).slice(-2);
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    };

    const getDayName = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const isFirstOrThirdSaturday = (date) => {
        if (date.getDay() !== 6) return false;
        const dayOfMonth = date.getDate();
        const weekOfMonth = Math.ceil(dayOfMonth / 7);
        return weekOfMonth === 1 || weekOfMonth === 3;
    };

    const months = [
        { name: "January", value: "1" },
        { name: "February", value: "2" },
        { name: "March", value: "3" },
        { name: "April", value: "4" },
        { name: "May", value: "5" },
        { name: "June", value: "6" },
        { name: "July", value: "7" },
        { name: "August", value: "8" },
        { name: "September", value: "9" },
        { name: "October", value: "10" },
        { name: "November", value: "11" },
        { name: "December", value: "12" }
    ];

    // Validate Google Sheet Link
    const validateSheetLink = (link) => {
        if (!link.trim()) {
            return { valid: false, message: "Please enter Google Sheet link!" };
        }

        // Check if it's a valid Google Sheets URL
        const googleSheetsPattern = /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
        if (!googleSheetsPattern.test(link)) {
            return { valid: false, message: "Invalid Google Sheets link! Please provide a valid link." };
        }

        return { valid: true };
    };

    // Check if employee exists in sheet data
    const checkEmployeeExists = (name, sheetsData) => {
        let employeeFound = false;

        Object.keys(sheetsData).forEach(sheetName => {
            const sheetData = sheetsData[sheetName];

            sheetData.forEach(row => {
                const nameColumn = row["Column 1"] || row["Nidhi Gondaliya"] || row["Employee Name"] || "";
                // Exact match with trim and lowercase
                if (nameColumn.trim().toLowerCase() === name.trim().toLowerCase()) {
                    employeeFound = true;
                }
            });
        });

        return employeeFound;
    };

    // Check if selected month data exists
    const checkMonthDataExists = (month, year, sheetsData) => {
        const monthNumber = parseInt(month);
        const daysInMonth = new Date(year, monthNumber, 0).getDate();
        let foundDates = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthNumber - 1, day);
            const dateStr = formatDate(date);

            const hasSheet = Object.keys(sheetsData).some(sheetName => {
                return sheetName.includes(dateStr) || sheetName === dateStr;
            });

            if (hasSheet) {
                foundDates++;
            }
        }

        return foundDates > 0;
    };

    const processAllSheets = (data) => {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetsData = {};
        let totalRows = 0;

        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, {
                defval: "",
                raw: false,
                header: 1
            });

            const headers = json[0] || [];
            const dataRows = json.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || "";
                });
                return obj;
            });

            const dateMatch = sheetName.match(/\d{2}-\d{2}-\d{4}/);
            if (dateMatch || sheetName.toLowerCase().includes('holiday') || sheetName.toLowerCase().includes('sunday')) {
                sheetsData[sheetName] = dataRows;
                totalRows += dataRows.length;
            }
        });

        console.log("sheetsDatasheetsData", sheetsData);

        setAllSheetData(sheetsData);
        return { sheetCount: Object.keys(sheetsData).length, totalRows, sheetsData };
    };

    const loadDataFromSheet = async () => {
        // Validate Sheet Link
        const linkValidation = validateSheetLink(sheetLink);
        if (!linkValidation.valid) {
            setError(linkValidation.message);
            return false;
        }

        setLoadingData(true);
        setError("");
        setSuccess("");
        setMissingDates([]);

        try {
            let exportUrl = sheetLink;

            if (sheetLink.includes("docs.google.com/spreadsheets")) {
                const match = sheetLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (match && match[1]) {
                    const sheetId = match[1];
                    exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
                }
            }

            const response = await fetch(exportUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch Excel file. Make sure the sheet is publicly accessible!");
            }

            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const result = processAllSheets(data);

            if (result.sheetCount === 0) {
                throw new Error("No valid sheets found in the Excel file!");
            }

            setSuccess(`✅ Data loaded successfully! `);
            return result;
        } catch (err) {
            console.error("Error loading data:", err);
            setError(err.message || "Failed to load data from sheet");
            return false;
        } finally {
            setLoadingData(false);
        }
    };


    const handleGenerateReport = async () => {
        // Validate Employee Name FIRST (before loading data)
        if (!employeeName.trim()) {
            setError("Please enter employee name!");
            return;
        }

        // Validate Month Selection
        if (!selectedMonth) {
            setError("Please select a month!");
            return;
        }

        // Now load data from sheet
        const dataLoaded = await loadDataFromSheet();

        if (!dataLoaded) {
            return;
        }

        // Wait a moment for data to be set
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("dataLoadeddataLoaded", dataLoaded);

        if (Object.keys(dataLoaded?.sheetsData || allSheetData).length === 0) {
            setError("Failed to load data. Please try again!");
            return;
        }

        // Check if employee exists in sheet (AFTER loading data)
        const employeeExists = checkEmployeeExists(employeeName, dataLoaded?.sheetsData || allSheetData);
        if (!employeeExists) {
            setError(`❌ Employee "${employeeName}" not found in the sheet! Please check the name and try again.`);
            return;
        }

        // Check if month data exists
        const monthDataExists = checkMonthDataExists(selectedMonth, selectedYear, dataLoaded?.sheetsData || allSheetData);
        if (!monthDataExists) {
            const monthName = months.find(m => m.value === selectedMonth)?.name;
            setError(`❌ No data found for ${monthName} ${selectedYear} in the sheet!`);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const wordData = {};
            const monthName = months.find(val => val.value === selectedMonth)?.name;
            const monthNumber = parseInt(selectedMonth);
            const year = selectedYear;
            const daysInMonth = new Date(year, monthNumber, 0).getDate();
            const datesWithoutTasks = [];

            const monthDates = [];
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, monthNumber - 1, day);
                const dateStr = formatDate(date);
                const dayName = getDayName(date);
                monthDates.push({
                    date: dateStr,
                    day: day,
                    dayName: dayName,
                    isSunday: date.getDay() === 0,
                    isFirstOrThirdSaturday: isFirstOrThirdSaturday(date)
                });
            }

            monthDates.forEach((dateInfo, index) => {
                const dayIndex = index + 1;
                let taskText = "";
                let hasTask = false;

                if (dateInfo.isSunday) {
                    taskText = "Sunday";
                    hasTask = true;
                } else if (dateInfo.isFirstOrThirdSaturday) {
                    taskText = "Saturday Holiday";
                    hasTask = true;
                } else {
                    const matchingSheet = Object.keys(allSheetData).find(sheetName => {
                        return sheetName.includes(dateInfo.date) || sheetName === dateInfo.date;
                    });

                    if (matchingSheet) {
                        const sheetData = allSheetData[matchingSheet];

                        if (matchingSheet.toLowerCase().includes('holiday')) {
                            taskText = "🎉 Holiday";
                            hasTask = true;
                        } else {
                            const employeeData = sheetData.filter(row => {
                                const nameColumn = row["Column 1"] || row["Nidhi Gondaliya"] || row["Employee Name"] || "";
                                return nameColumn.toLowerCase().includes(employeeName.toLowerCase());
                            });

                            if (employeeData.length > 0) {
                                employeeData.forEach((row) => {
                                    const eodDone = row["EOD - What's Done"] || row["What's Done"] || row["Done"] || "";
                                    if (eodDone) {
                                        taskText += `\n${eodDone}\n\n`;
                                        hasTask = true;
                                    }
                                });
                            }
                        }
                    }
                }

                // Track dates without tasks (excluding Sundays and Saturdays)
                if (!hasTask && !dateInfo.isSunday && !dateInfo.isFirstOrThirdSaturday) {
                    datesWithoutTasks.push({
                        date: dateInfo.date,
                        day: dateInfo.dayName
                    });
                }

                wordData[`date${dayIndex}`] = dateInfo.date;
                wordData[`d${dayIndex}`] = taskText.trim() || "";
            });

            for (let i = daysInMonth + 1; i <= 31; i++) {
                wordData[`date${i}`] = "";
                wordData[`d${i}`] = "";
            }

            // Set missing dates for display
            setMissingDates(datesWithoutTasks);

            const formData = new FormData();
            formData.append('data', JSON.stringify(wordData));
            formData.append('employeeName', employeeName);
            formData.append('month', monthName);
            formData.append('year', selectedYear);

            const response = await fetch('http://localhost:5000/generate-word-from-excel', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate Word document');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${employeeName.replace(/\s+/g, '_')}_${monthName}_${year}_report.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setSuccess("✅ Report generated and downloaded successfully!");
        } catch (err) {
            console.error("Error:", err);
            setError(err.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                py: 6,
                px: 2
            }}
        >
            <Container maxWidth="md">
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: 5 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            margin: "0 auto",
                            mb: 2,
                            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
                        }}
                    >
                        <DescriptionIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1,
                            textShadow: "0 2px 10px rgba(0,0,0,0.2)"
                        }}
                    >
                        Monthly Report Generator
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#6b7280" }}>
                        Generate your monthly work report in seconds
                    </Typography>
                </Box>

                {/* Main Card */}
                <Card
                    elevation={24}
                    sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(10px)"
                    }}
                >
                    <CardContent sx={{ p: 5 }}>
                        <Stack spacing={4}>
                            {/* Google Sheet Link */}
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        color: "#667eea",
                                        mb: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1
                                    }}
                                >
                                    <LinkIcon sx={{ fontSize: 20 }} />
                                    Google Sheet Link
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={sheetLink}
                                    onChange={(e) => setSheetLink(e.target.value)}
                                    placeholder="Paste your Google Sheet link here..."
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            backgroundColor: "#f8f9ff",
                                            "&:hover": {
                                                backgroundColor: "#f0f2ff"
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: "white"
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* Employee Name */}
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        color: "#667eea",
                                        mb: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 20 }} />
                                    Employee Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={employeeName}
                                    onChange={(e) => setEmployeeName(e.target.value)}
                                    placeholder="Enter your name (e.g., Meet Parkhiya)"
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            backgroundColor: "#f8f9ff",
                                            "&:hover": {
                                                backgroundColor: "#f0f2ff"
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: "white"
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* Month and Year */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 600,
                                            color: "#667eea",
                                            mb: 1.5,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        <CalendarMonthIcon sx={{ fontSize: 20 }} />
                                        Month
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                backgroundColor: "#f8f9ff",
                                                "&:hover": {
                                                    backgroundColor: "#f0f2ff"
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="">-- Select --</MenuItem>
                                        {months.map((m) => (
                                            <MenuItem key={m.value} value={m.value}>
                                                {m.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 600,
                                            color: "#667eea",
                                            mb: 1.5
                                        }}
                                    >
                                        Year
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                backgroundColor: "#f8f9ff",
                                                "&:hover": {
                                                    backgroundColor: "#f0f2ff"
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value={2024}>2024</MenuItem>
                                        <MenuItem value={2025}>2025</MenuItem>
                                        <MenuItem value={2026}>2026</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>

                            {/* Messages */}
                            {success && (
                                <Alert
                                    icon={<CheckCircleIcon />}
                                    severity="success"
                                    sx={{ borderRadius: 2 }}
                                >
                                    {success}
                                </Alert>
                            )}

                            {error && (
                                <Alert
                                    icon={<ErrorOutlineIcon />}
                                    severity="error"
                                    sx={{ borderRadius: 2 }}
                                >
                                    {error}
                                </Alert>
                            )}

                            {/* Missing Dates Warning */}
                            {missingDates.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: "#fff9e6",
                                        border: "2px solid #ffe58f"
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <WarningAmberIcon sx={{ color: "#fa8c16", mt: 0.5 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 700, color: "#ad6800", mb: 2 }}
                                            >
                                                ⚠️ Dates without tasks: ({missingDates.length})
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                {missingDates.map((item, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={`${item.date} (${item.day})`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: "white",
                                                            border: "1px solid #ffe58f",
                                                            color: "#ad6800",
                                                            fontWeight: 500,
                                                            mb: 1
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Paper>
                            )}

                            {/* Generate Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleGenerateReport}
                                disabled={loading || loadingData || !employeeName.trim() || !selectedMonth || !sheetLink.trim()}
                                startIcon={
                                    loadingData || loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        <DownloadIcon />
                                    )
                                }
                                sx={{
                                    py: 2,
                                    borderRadius: 2,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                        boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)",
                                        transform: "translateY(-2px)"
                                    },
                                    "&:disabled": {
                                        background: "linear-gradient(135deg, #ccc 0%, #999 100%)",
                                        color: "white",
                                        opacity: 0.7
                                    },
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {loadingData
                                    ? "Loading data from sheet..."
                                    : loading
                                        ? "Generating report..."
                                        : "Generate & Download Report"}
                            </Button>

                            <Divider />

                            {/* Info Box */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)",
                                    border: "2px solid #e0e7ff"
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <InfoIcon sx={{ color: "#667eea", mt: 0.5 }} />
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 700, color: "#667eea", mb: 1.5 }}
                                        >
                                            How it works
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Typography variant="body2" sx={{ color: "#4b5563" }}>
                                                • Paste your Google Sheet link (make sure it's publicly accessible)
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#4b5563" }}>
                                                • Enter your name exactly as it appears in the sheet
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#4b5563" }}>
                                                • Select month/year for which data exists in the sheet
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#4b5563" }}>
                                                • Click the button to validate and generate report
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#4b5563" }}>
                                                • Your Word document will be downloaded automatically
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center",
                        mt: 4,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Made with ❤️ for easy report generation
                </Typography>
            </Container>
        </Box>
    );
}