import { Box, Typography, CircularProgress } from "@mui/material";

export default function StatusBox({ excel, template, loading }) {
  return (
    <Box
      sx={{
        background: "#fff",
        p: 3,
        mt: 3,
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Typography fontWeight={700} mb={2}>
        Status
      </Typography>

      {excel && (
        <Typography>
          ✔️ {excel.name}
        </Typography>
      )}

      {template && (
        <Typography>
          🔵 {template.name}
        </Typography>
      )}

      {loading && (
        <Box mt={2} display="flex" gap={1} alignItems="center">
          <CircularProgress size={22} />
          <Typography>Generating...</Typography>
        </Box>
      )}
    </Box>
  );
}
