import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    Typography,
    Avatar,
    CircularProgress,
    Chip,
    Stack,
    Paper,
} from "@mui/material";
import {
    Close,
    Link,
    Person,
    CalendarMonth,
    Event,
    AutoAwesome,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { DownloadIcon } from "lucide-react";

/* -------------------- CONSTANTS -------------------- */

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
    { name: "December", value: "12" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);


/* -------------------- HELPERS -------------------- */

const validateSheetLink = (link) => {
    if (!link.trim()) {
        return { valid: false, message: "Please enter Google Sheet link" };
    }
    const pattern = /docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    if (!pattern.test(link)) {
        return { valid: false, message: "Invalid Google Sheet link" };
    }
    return { valid: true };
};

const processAllSheets = (data) => {
    const workbook = XLSX.read(data, { type: "array" });
    const sheetsData = {};

    workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
            header: 1,
        });

        const headers = json[0] || [];
        const rows = json.slice(1).map((row) => {
            const obj = {};
            headers.forEach((h, i) => (obj[h] = row[i] || ""));
            return obj;
        });

        sheetsData[sheetName] = rows;
    });

    return sheetsData;
};

/* -------------------- COMPONENT -------------------- */

const GenerateReportModal = ({ open, onClose, fetchReportList }) => {
    const [sheetLink, setSheetLink] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);

    const [loadingData, setLoadingData] = useState(false);
    const [allSheetData, setAllSheetData] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [missingDates, setMissingDates] = useState([]);

    /* -------------------- MAIN LOGIC -------------------- */
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

    const handleGenerate = async () => {
        const validation = validateSheetLink(sheetLink);
        if (!validation.valid) {
            toast.error(validation.message);
            return;
        }

        if (!employeeName.trim()) {
            toast.error("Please enter employee name");
            return;
        }

        if (!month || !year) {
            toast.error("Please select month & year");
            return;
        }

        const dataLoaded = await loadDataFromSheet();

        if (!dataLoaded) {
            return;
        }

        setLoading(true);

        try {
            /* Convert Google Sheet to XLSX */
            const match = sheetLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
            const sheetId = match[1];
            const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;

            const response = await fetch(exportUrl);
            if (!response.ok) {
                throw new Error("Sheet not accessible (Make it public)");
            }

            const buffer = await response.arrayBuffer();
            const sheetsData = processAllSheets(new Uint8Array(buffer));

            const wordData = {};
            const monthName = months.find(val => val.value === month)?.name;
            const monthNumber = parseInt(month);
            // const year = selectedYear;
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
                    const sheetSource =
                        allSheetData && Object.keys(allSheetData).length > 0
                            ? allSheetData
                            : dataLoaded?.sheetsData || {};

                    const matchingSheet = Object.keys(sheetSource).find(sheetName => {
                        return sheetName.includes(dateInfo.date) || sheetName === dateInfo.date;
                    });

                    if (matchingSheet) {
                        const sheetData = sheetSource[matchingSheet];

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

            const now = new Date();

            // DD-MM-YYYY format
            const generatedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
                now.getMonth() + 1
            ).padStart(2, "0")}-${now.getFullYear()}`;
            const formData = new FormData();
            formData.append('data', JSON.stringify(wordData));
            formData.append('employeeName', employeeName);
            formData.append('month', monthName);
            formData.append('year', year);
            formData.append("generatedDate", generatedDate);
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/generate-word-from-excel`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                throw new Error("Failed to generate report");
            }

            if (res.ok) {
                await fetchReportList()
            }

            /* Download Word File */
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${employeeName}_${month}_${year}_report.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.success("Report generated & downloaded");
            handleClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSheetLink("");
        setEmployeeName("");
        setMonth("");
        setYear("");
        onClose();
    };

    /* -------------------- UI (UNCHANGED) -------------------- */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 4, overflow: "hidden" },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    p: 3,
                    position: "relative",
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                    }}
                >
                    <Close />
                </IconButton>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                        <AutoAwesome sx={{ color: "white" }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                            Generate New Report
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                            Fill details to generate report
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField
                        label="Sheet Link"
                        value={sheetLink}
                        onChange={(e) => setSheetLink(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: <Link sx={{ mr: 1 }} />,
                        }}
                    />

                    <TextField
                        label="Employee Name"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: <Person sx={{ mr: 1 }} />,
                        }}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Month</InputLabel>
                            <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
                                {months.map((m) => (
                                    <MenuItem key={m.value} value={m.value}>
                                        {m.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
                                {years.map((y) => (
                                    <MenuItem key={y} value={y.toString()}>
                                        {y}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleGenerate}
                    variant="contained"
                    disabled={loading || loadingData || !employeeName.trim() || !month || !year || !sheetLink.trim()}

                    startIcon={
                        loadingData || loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <DownloadIcon />
                        )
                    }
                >
                    {loadingData
                        ? "Loading..."
                        : loading
                            ? "Generating report..."
                            : "Generate Report"}
                </Button>

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
                            {/* <WarningAmberIcon sx={{ color: "#fa8c16", mt: 0.5 }} /> */}
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
            </DialogActions>
        </Dialog>
    );
};

export default GenerateReportModal;
