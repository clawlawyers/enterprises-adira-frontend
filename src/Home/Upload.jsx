import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import UploadDialog from "../components/Dialogs/UploadDialog";
import { setIsThisBypromptFalse } from "../features/DocumentSlice";
import { Helmet } from "react-helmet";

const Upload = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsThisBypromptFalse());
  }, []);
  return (
    <div className="h-screen p-2">
      <Helmet>
        <title>Secure Document Uploads with Adira AI</title>
        <meta
          name="description"
          content="Easily upload and manage your legal documents with Adira's secure and intuitive platform. Designed to simplify your workflow and keep your data safe."
        />
        <meta
          name="keywords"
          content="secure uploads, legal documents, Adira platform, upload automation, document management, legaltech solutions, AI legal tools, secure data handling, law firm tech, digital transformation"
        />
      </Helmet>
      <UploadDialog />
    </div>
  );
};

export default Upload;
