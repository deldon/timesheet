import "./style.scss";
import { useQuery } from "react-query";
import { useState } from "react";
import request from "../../request/query/request";
import StudentCard from "../StudentCard/StudentCard";
import { useNavigate } from "react-router-dom";

import Titel from "../Title/Title";
import Spinner from "../Spinner/Spinner";

function Mystudent({ user }) {
  const [toggelPost, setToggelPost] = useState(false);
  const [studyId, setStudyId] = useState("");

  const navigate = useNavigate();
  const { isLoading, error, data, isFetching } = useQuery(
    "repoData",
    request.myStudent
  );

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred: " + error.message;

  const link = (data) => {
    navigate(`/myCours/${data.id}`);
  };

  return (
    <div className="signature">
      <Titel text="Mes élèves" />

      <div className="signature_wrapper">
        {data.map((data) => (
          <StudentCard data={data} handelClick={link} />
        ))}
      </div>
    </div>
  );
}

export default Mystudent;
