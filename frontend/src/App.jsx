//import { useState } from 'react'

import "./App.scss";

import { useState, createContext, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./component/Header/Header";
import Login from "./component/login/Login";
import Signature from "./component/signature/Signature";
import Mycours from "./component/Mycours/Mycours";
import Mystudent from "./component/Mystudent/Mystudent";
import Profile from "./component/Profile/Profile";
import AllSignature from "./component/AllSignature/AllSignature";
import Detail from "./component/Detail/Detail";
import Student from "./component/Student/Student"
import StudentTrash from "./component/StudentTrash/StudentTrash";
import Teacher from "./component/Teacher/Teacher";
import TeacherTrash from "./component/TeacherTrash/TeacherTrash";

function App() {
  const [isLogged, setIsLogged] = useState(true);
  const [user, setUser] = useState({});

  const disconnect = () => {
    setUser({});
    setIsLogged(true);
  };

  return (
    <>
      {isLogged && <Login setIsLogged={setIsLogged} setUser={setUser} />}
      {!isLogged && (
        <div>
          <Header user={user} disconnect={disconnect} />
          <div className="main">
            <Routes>
              <Route path="/" element={<Signature user={user} />} />
              <Route path="/mycours" element={<Mycours />}>
                <Route path=":id" element={<Mycours />} />
              </Route>
              <Route path="/mystudent" element={<Mystudent user={user} />} />
              <Route path="/myprofile" element={<Profile disconnect={disconnect}  />} />
              {user.is_admin && (
                <>
                <Route path="/teacher" element={<Teacher />} />
                <Route path="/student" element={<Student />} />

                
                <Route path="/student-trash" element={<StudentTrash />} />
                <Route path="/teacher-trash" element={<TeacherTrash />} />
                <Route path="/recap" element={<AllSignature />} />
                <Route path="/detail" element={<Detail />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
