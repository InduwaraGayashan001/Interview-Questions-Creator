import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  Container,
  Typography,
  Card,
  Button,
  LinearProgress,
  Box,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Layout } from "./components/Layout";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qaList, setQaList] = useState([]);
  const [status, setStatus] = useState("initial");
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus("processing");

    const formData = new FormData();
    formData.append("pdf_file", file);
    formData.append("filename", file.name);

    try {
      const uploadResponse = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.msg === "error") {
        alert("Maximum number of pages exceeded.");
        setLoading(false);
        return;
      }

      const analyzeForm = new FormData();
      analyzeForm.append("pdf_filename", uploadData.pdf_filename);

      const analyzeResponse = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: analyzeForm,
      });

      const analyzeData = await analyzeResponse.json();
      setQaList(analyzeData.qa_pairs || []);
      setStatus("done");
    } catch (error) {
      alert("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewQA = () => {
    navigate("/qa", { state: { qaList } });
  };

  const handleDownload = () => {
    const blob = new Blob(
      [
        "Question,Answer\n" +
        qaList.map((qa) => `"${qa.question}","${qa.answer}"`).join("\n"),
      ],
      { type: "text/csv" }
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qa.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  return (
    <Layout>
      <Container maxWidth="lg">
        <Container sx={{ p: 2, mt: 3, bgcolor: "transparent" }}>
          <Box
            {...getRootProps()}
            sx={{
              border: file ? "1px solid cyan" : "1px dashed cyan",
              borderRadius: 2,
              p: 5,
              textAlign: "center",
              height: "150px",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              color: "white",
              cursor: "pointer",
              backgroundColor: file ? "#123" : "#122",
              "&:hover": {
                backgroundColor: "#123",
              },
              transition: "0.2s ease-in-out",
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                gap={2}
              >
                <PictureAsPdfIcon sx={{ color: 'cyan', fontSize: 50}} />
                <Typography variant="h6" sx={{ color: 'cyan', maxWidth: '100%' }}>
                  {file.name} {file.size > 1000000 ? `(${(file.size / 1000000).toFixed(2)} MB)` : `(${(file.size / 1000).toFixed(2)} KB)`}
                </Typography>
                <HighlightOffRoundedIcon onClick={() => setFile(null)} sx={{ color: 'cyan' , fontSize: 50 , ml: 85 }} />
              </Box>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={2}>
                  <FileUploadRoundedIcon sx={{ color: "cyan", fontSize: 80 }} />
                  <Typography variant="body1" sx={{ color: "cyan"}}>
                    {isDragActive
                      ? "Drop the PDF file here..."
                      : "Drop your PDF here or click to upload"}
                  </Typography>
                </Box>
            )}
          </Box>


          <Box textAlign="right" mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              Generate Q&A
            </Button>
          </Box>
        </Container>

        <Container sx={{ p: 1, bgcolor: "transparent", justifyContent: "center", alignItems: "center" }}>
          {status === "initial" && (
            <>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={3}>
              <Typography
                variant="h3"
                sx={{
                  background: 'linear-gradient(45deg, #00e5ff 30%, #00c853 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.05em',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                Welcome to InteliPrep!
              </Typography>
              <EmojiObjectsIcon sx={{ fontSize: 60, color: "#00e676" }} />  
              </Box>
            <Typography
                variant="h6"
                sx={{
                  color: "white",
                  textAlign: "center",
                  mb: 2,
                  fontSize: "1.2rem",
                }}
            >
                No more guessing what to study. With Inteliprep, simply upload your PDF and unlock a curated list of Q&As designed to challenge your thinking and accelerate your learning.
            </Typography>
              </>
          )}
          {status === "processing" && (
            <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2, // spacing between text and icon
                  mb: 3,  // optional bottom margin
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    animation: 'fadeLeftRight 2s ease-in-out infinite',
                    '@keyframes fadeLeftRight': {
                      '0%': { opacity: 0, transform: 'translateX(-40px)' },
                      '50%': { opacity: 1, transform: 'translateX(0)' },
                      '100%': { opacity: 0, transform: 'translateX(40px)' },
                    },
                    fontWeight: "bold",
                    background: 'linear-gradient(45deg, #00e5ff 30%, #00c853 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.05em',
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    mt: 2,
                  }}
                  gutterBottom
                >
                  Generating your Q&A...
                </Typography>
              </Box>
              <LinearProgress sx={{ width: "100%", height: 10, borderRadius: 5 }} />
            </Container>
          )}

          {status === "done" && (
            <Container
              sx={{
                bgcolor: "transparent",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2, // spacing between text and icon
                  mb: 3,  // optional bottom margin
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    background: 'linear-gradient(45deg, #00e5ff 30%, #00c853 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.05em',
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    mt: 2,
                  }}
                  gutterBottom
                >
                  Q&A Successfully Created!
                </Typography>

                <CheckCircleIcon sx={{ fontSize: 60, color: "#00e676" }} />
              </Box>
              <Box mt={2} display="flex" gap={2}>
                <Button variant="outlined" color="primary" onClick={handleViewQA}>
                  View Q&A
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleDownload}>
                  Download CSV
                </Button>
              </Box>
            </Container>
          )}
        </Container>
      </Container>
    </Layout>
  );
}

export default App;
