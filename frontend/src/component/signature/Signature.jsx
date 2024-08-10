import "./style.scss";
import { useQuery } from "react-query";
import request from "../../request/query/request";
import { useState } from "react";
import PostSignature from "../PostSignature/PostSignature";
import StudentCard from "../StudentCard/StudentCard";
import Titel from "../Title/Title";
import Spinner from "../Spinner/Spinner";

function Signature({ user }) {
  const [toggelPost, setToggelPost] = useState(false);
  const [studyId, setStudyId] = useState("");
  const { isLoading, error, data, isFetching } = useQuery(
    "repoData",
    request.myStudent
  );

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred: " + error.message;

  const handelClick = (data) => {
    setToggelPost(true);
    setStudyId(data.id);
  };

  return (
    <>
      <div className="signature">
        <Titel text="Émargement" />
        <div className="signature_wrapper">
          {data.map((data) => (
            <StudentCard key={data.id} data={data} handelClick={handelClick} />
          ))}
        </div>
      </div>

      {toggelPost && (
        <PostSignature
          studyId={studyId}
          teacherId={user.id}
          setToggelPost={setToggelPost}
        />
      )}
    </>
  );
}

export default Signature;
