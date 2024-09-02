import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  card: {
    width: "200px",
    height: "250px",
    margin: "16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  media: {
    height: 140,
    position: "relative",
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

interface DocumentCardProps {
  title: string;
  imageUrl: string;
  onClick: () => void;
  loading: boolean;
}

export const DocumentCard = ({
  loading,
  title,
  imageUrl,
  onClick,
}: DocumentCardProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} onClick={onClick}>
      <CardMedia
        className={classes.media}
        image={imageUrl}
        title={title}
        sx={{
          backgroundSize: "contain",
        }}
      >
        {loading && <CircularProgress className={classes.spinner} />}
      </CardMedia>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
