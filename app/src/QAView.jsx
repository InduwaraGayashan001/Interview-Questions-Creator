import React from "react";
import { Container, Typography, Card, CardContent, Button, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";

function QAView() {

    const { state } = useLocation();
    const qaList = state?.qaList || [];

    return (
        <Layout>
            <Container maxWidth="lg" >
                <Container sx={{ pb: 3 }}>
                    {qaList.map((qa, index) => (
                        <Card key={index} sx={{ my: 2, p: 2, backgroundColor: "#1a1a1a", color: "white", borderRadius: 2 , border: '0.5px solid cyan', '&:hover': { boxShadow: 3, transform: 'scale(1.02)', backgroundColor:"#122" } }}>
                            <CardContent>
                                <Typography variant="h6" color="cyan">
                                    Q{index + 1}: {qa.question}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mt: 1 }}
                                    dangerouslySetInnerHTML={{ __html: qa.answer }}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </Container>
            </Container>
        </Layout>
    );
}

export default QAView;
