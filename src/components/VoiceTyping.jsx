import React, { useEffect, useState } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

import {
    Box,
    Button,
    Typography,
    TextField,
    MenuItem,
    Stack,
    Chip,
    Paper,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";

const VoiceTyping = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const [language, setLanguage] = useState("gu-IN");
    const [text, setText] = useState("");

    // Language change → stop + clear
    useEffect(() => {
        SpeechRecognition.stopListening();
        resetTranscript();
        setText("");
    }, [language]);

    // Whenever transcript updates → update text
    useEffect(() => {
        setText(transcript);
    }, [transcript]);

    const startListening = () => {
        resetTranscript();
        setText("");
        SpeechRecognition.startListening({
            continuous: true,
            language: language,
        });
    };

    if (!browserSupportsSpeechRecognition) {
        return (
            <Typography color="error">
                Your browser does not support speech recognition
            </Typography>
        );
    }

    return (
        <Paper elevation={4} sx={{ maxWidth: 520, mx: "auto", mt: 5, p: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
                🎙 Voice Typing
            </Typography>
            <Typography variant="h6" align="center" sx={{mb:2}}>
               react-speech-recognition
            </Typography>

            {/* Language Selector */}
            <TextField
                select
                fullWidth
                label="Select Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                sx={{ mb: 3 }}
            >
                <MenuItem value="gu-IN">Gujarati</MenuItem>
                <MenuItem value="hi-IN">Hindi</MenuItem>
                <MenuItem value="en-IN">English</MenuItem>
            </TextField>

            {/* Controls */}
            <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<MicIcon />}
                    onClick={startListening}
                >
                    Start
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={SpeechRecognition.stopListening}
                >
                    Stop
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                        resetTranscript();
                        setText("");
                    }}
                >
                    Clear
                </Button>
            </Stack>

            {/* Status */}
            <Box textAlign="center" mt={2}>
                <Chip
                    label={listening ? "Listening..." : "Stopped"}
                    color={listening ? "success" : "default"}
                />
            </Box>

            {/* Editable Text Area */}
            <TextField
                multiline
                rows={6}
                fullWidth
                value={text}
                onChange={(e) => {
                    if (e?.target.value == "") {
                        resetTranscript();
                    }
                    setText(e.target.value)
                }}
                placeholder="Speak or type here..."
                sx={{ mt: 3 }}
            />
        </Paper>
    );
};

export default VoiceTyping;
