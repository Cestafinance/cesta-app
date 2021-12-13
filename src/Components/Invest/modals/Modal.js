import { Fragment } from "react";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    background: "#0F1322",
    borderRadius: "16px",
    border: "1px solid rgba(75, 134, 242, 0.5)",
    width: "100%",
  },
}));

const MuiDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: "#FFFFFF",
  minHeight: "60px",
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "500",
  fontSize: "1rem",
  lineHeight: "1rem",
  marginLeft: "2.5rem",
}));

const SubTitleTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Rubik",
  fontStyle: "normal",
  fontWeight: "200",
  fontSize: "0.8rem",
  lineHeight: "0.8rem",
  margin: "6px 0 0 2.5rem",
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <MuiDialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

function ActionConfirm({ open, handleClose, titleMain, subTitle, content }) {
  return (
    <Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <TitleTypography>{titleMain}</TitleTypography>
          {subTitle && <SubTitleTypography>{subTitle}</SubTitleTypography>}
        </BootstrapDialogTitle>
        <DialogContent dividers>{content}</DialogContent>
      </BootstrapDialog>
    </Fragment>
  );
}

export default ActionConfirm;
