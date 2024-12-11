import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import logo from "../../assets/icons/logo.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUploadDocText } from "../../features/DocumentSlice";

const ResponseDialog = ({ open, onClose,  onSave }) => {
  const dispatch = useDispatch();
  const responseText = useSelector((data) => data.document.uploadDocText)
  const navigate = useNavigate();
  const [text, setText] = useState(responseText);
  const [isEditing, setIsEditing] = useState(false);

  // Sync the state with the prop whenever it changes
  useEffect(() => {
    
    setText(responseText);
    dispatch(setUploadDocText(responseText));
  }, [responseText]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
    onClose();
    navigate("/Snippets");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="backdrop-blur-sm"
      fullWidth
      maxWidth="md"
    >
      <div className="bg-[#495f5f] flex h-fit flex-col">
        <DialogContent className="flex p-0 h-[90vh]">
          <Box className="flex-1 overflow-y-auto h-full hide-scrollbar p-4">
            <TextField
              sx={{
                border: `${isEditing ? "5px solid teal" : ""} `,
                outline: "none",
              }}
              multiline
              rows={25}
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              className={`bg-white text-neutral-800 outline-none rounded-md transition-all duration-100 ${
                isEditing ? "border-3 border-green-500" : ""
              }`}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Box>
          <Box className="flex-1 flex flex-col items-center justify-between p-4 h-full">
            <div className="w-full flex flex-row gap-2 items-center justify-center">
              <Typography variant="h3" className="font-bold text-teal-500">
                Adira AI
              </Typography>
              <sup className="text-white text-base">by CLAW</sup>
            </div>

            <div>
              <img src={logo} alt="claw logo" />
            </div>
            <DialogActions className="p-4">
              {!isEditing ? (
                <>
                  <button
                    className="font-semibold p-2 border-2 rounded-md text-white border-white"
                    onClick={handleEdit}
                  >
                    Edit Document
                  </button>
                  <button
                    className="font-semibold p-2 px-10 border-2 rounded-md text-white border-white"
                    onClick={handleSave}
                  >
                    Save and Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="font-semibold p-2 border-2 rounded-md text-white border-white"
                    onClick={() => setIsEditing(false)}
                  >
                    Save Changes
                  </button>
                  <button
                    className="font-semibold p-2 border-2 rounded-md text-white border-white"
                    onClick={handleSave}
                  >
                    Save and Close
                  </button>
                </>
              )}
            </DialogActions>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default ResponseDialog;
