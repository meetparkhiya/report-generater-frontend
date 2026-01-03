import React, { useState } from "react";
import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as mammoth from "mammoth";
import axios from "axios";

export default function Template() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]); // store parsed tasks

    // ---------------------------
    // HANDLE CHOOSE FILE
    // ---------------------------
    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };


    // ---------------------------
    // HANDLE UPLOAD AND PARSE DOCX
    // ---------------------------
    const handleUpload = async () => {
        if (!file) return alert("Please select a Word file!");
        setLoading(true);

        const tasksa = [
            { Name: "Task A", Date: "2025-11-29" },
            { Name: "Task B", Date: "2025-11-30" },
        ];

        const formData = new FormData();
        formData.append("template", file); // Word template
        formData.append("tasks", JSON.stringify(tasksa));

        const res = await axios.post("http://localhost:5000/generate-word", formData, {
            responseType: "blob",
        });

        // Download generated Word
        const blob = new Blob([res.data], { type: res.data.type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tasks.docx";
        a.click();


        try {
            const arrayBuffer = await file.arrayBuffer();

            const result = await mammoth.extractRawText({ arrayBuffer });
            const text = result.value; // full text of Word file

            // Assuming tasks are in "Name | Date" format, one per line
            const lines = text.split("\n").filter(Boolean);
            console.log("📋 Parsed Tasks:", lines);

            const parsedTasks = lines.map((line) => {
                const [Name, DateStr] = line.split("|").map((x) => x.trim());
                return { Name, Date: DateStr };
            });

            setTasks(parsedTasks);
            alert("Tasks parsed! Check console.");
        } catch (err) {
            console.error(err);
            alert("Error reading Word file!");
        }

        setLoading(false);
    };

    return (
        <Box
            sx={{
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f7f9fc",
                p: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: { xs: "95%", sm: "85%", md: "500px" },
                    p: 4,
                    textAlign: "center",
                    borderRadius: "20px",
                }}
            >
                <CloudUploadIcon sx={{ fontSize: 60, color: "#1976d2" }} />

                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                    Upload Word File
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                    Choose your Word (.docx) file to extract tasks
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <input
                        type="file"
                        accept=".docx"
                        style={{ display: "none" }}
                        id="word-upload"
                        onChange={handleFile}
                    />
                    <label htmlFor="word-upload">
                        <Button
                            variant="contained"
                            component="span"
                            sx={{ borderRadius: "10px", paddingX: 4 }}
                        >
                            Choose File
                        </Button>
                    </label>

                    {file && (
                        <Typography sx={{ mt: 1, fontSize: "14px" }}>
                            Selected: {file.name}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ mt: 4 }}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.2,
                                borderRadius: "10px",
                                fontWeight: "bold",
                                background: "#1976d2",
                            }}
                            onClick={handleUpload}
                        >
                            Upload & Process
                        </Button>
                    )}
                </Box>


            </Paper>
        </Box>
    );
}
