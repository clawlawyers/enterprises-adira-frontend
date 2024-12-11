import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import Hero from "./Home/Hero/Hero";
import Upload from "./Home/Upload";
import Snippets from "./Snippets/Snippets";
import SummaryDialog from "./components/Dialogs/SummaryDialog";
import FavourDialog from "./components/Dialogs/FavourDialog";
import DirectionDialog from "./components/Dialogs/DirectionDialog";
import NeutralDialog from "./components/Dialogs/NeutralDialog";
import DocDrafter from "./DocDrafter/DocDrafter";
import DrafterArgs from "./DocDrafter/DrafterArgs";
import DocType from "./DocType/DocType";
import DocEdit from "./DocEdit/DocEdit";
import Summary from "./Summary/Summary";
import ManageDoc from "./components/ManageDocs/ManageDoc";
import Login from "./Login/Login";
import store from "./features/store";
import {
  retrieveDrafterAuth,
  setLoadingFalse,
  setLoadingTrue,
} from "./features/authSlice";
import { useSelector } from "react-redux";
import { CircularProgress, Modal } from "@mui/material";
import AdminLogin from "./AdminLogin/AdminLogin";
import PromptFile from "./PromptFile/PromptFile";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Hero></Hero>,
//   },
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/manageDoc",
//     element: <ManageDoc />,
//   },
//   {
//     path: "/upload",
//     element: <Upload />,
//   },
//   {
//     path: "/DocPreview",
//     element: <DocEdit />,
//   },
//   {
//     path: "/Summary",
//     element: <Summary />,
//   },

//   {
//     path: "/Snippets",
//     element: <Snippets />,
//     children: [
//       {
//         path: "",
//         element: <Snippets />,
//       },
//       {
//         path: "Summary/:id",
//         element: <SummaryDialog />,
//       },
//       {
//         path: "Neutral/:id",
//         element: <NeutralDialog />,
//       },
//       {
//         path: "Favour/:id",
//         element: <FavourDialog />,
//       },
//       {
//         path: "Direction/:id",
//         element: <DirectionDialog />,
//       },
//     ],
//   },
//   {
//     path: "/Drafter",
//     element: <DocDrafter />,
//   },
//   {
//     path: "/Drafter/DrafterArgs",
//     element: <DrafterArgs />,
//   },
//   {
//     path: "/DocType",
//     element: <DocType />,
//     children: [],
//   },
// ]);

function AuthGuard() {
  console.log("hi");

  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const currentStatus = useSelector((state) => state.auth.status);
  console.log(currentStatus);
  const userLoading = useSelector((state) => state.auth.userLoading);
  console.log(userLoading);

  useEffect(() => {
    // If there's no current user, redirect to the login page
    if (currentStatus === "success" && currentUser) {
      store.dispatch(setLoadingFalse());
      navigate("/");
    } else if (currentStatus === "pending") {
      store.dispatch(setLoadingTrue());
    } else {
      store.dispatch(setLoadingFalse());
      navigate("/login");
    }
  }, [currentStatus, currentUser, userLoading]);

  useEffect(() => {
    // Dispatch the action to retrieve drafter auth
    // store.dispatch(retrieveDrafterAuth());
    console.log("here");
  }, []);
  console.log("here i am");

  return (
    <>
      {userLoading && (
        <Modal className="w-full h-full" open={userLoading}>
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress size={100} color="inherit" />
          </div>
        </Modal>
      )}
    </>
  );
}

function App() {
  // const currentuser = useSelector((state)=> state.auth.user)
  // if(!currentuser){
  //   window.location.replace("https://clawlaw-dev.netlify.app/")
  // }

  // localStorage.clear();
  return (
    <Router>
      {/* <AuthGuard /> */}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manageDoc" element={<ManageDoc />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/DocPreview" element={<DocEdit />} />
        <Route path="/Summary" element={<Summary />} />
        <Route path="/Snippets" element={<Snippets />}>
          <Route index element={<Snippets />} />
          <Route path="Summary/:id" element={<SummaryDialog />} />
          <Route path="Neutral/:id" element={<NeutralDialog />} />
          <Route path="Favour/:id" element={<FavourDialog />} />
          <Route path="Direction/:id" element={<DirectionDialog />} />
        </Route>
        <Route path="/Drafter" element={<DocDrafter />} />
        <Route path="/Drafter/DrafterArgs" element={<DrafterArgs />} />
        <Route path="/DocType" element={<DocType />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/Prompt" element={<PromptFile />} />
      </Routes>
    </Router>
  );
}

export default App;
