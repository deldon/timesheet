import "./style.scss";
import { useQuery, useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";
import request from "../../request/query/request";
import Spinner from "../Spinner/Spinner";
import StudentCard from "../StudentCard/StudentCard";
import Title from "../Title/Title";
import { useState } from "react"; // Importer useState pour gérer l'état local

function AddStudentToTeacher({ teacherData, Close }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche

  const mutation = useMutation(requestMutation.AddStudentToTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries(["AllTeacher"]);
      queryClient.invalidateQueries(["NotStudent"]);
      //Close();
    },
    onError: (e) => {},
  });

  const handelClick = (e) => {
    mutation.mutate({
      teacher_id: teacherData.id,
      student_id: e.id,
    });
  };

  const { isLoading, error, data } = useQuery(
    ["NotStudent", teacherData.id],
    async () => {
      const data = await request.getStudentNotTeacher(teacherData.id);
      return data;
    },
    {
      refetchOnWindowFocus: true,
      staleTime: 0,
      cacheTime: 0,
      refetchInterval: 0,
    }
  );

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred: " + error.message;

  // Fonction pour filtrer les étudiants en fonction du terme de recherche
  const filteredData = (data || []).filter((student) => {
    return (student.lastname || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="AddStudentToTeacher">
      <div className="AddStudentToTeacher_title">
        Ajouter un étudiant à {teacherData.firstname} {teacherData.lastname}
      </div>
      <div className="AddStudentToTeacher_search">
        <input
          type="text"
          placeholder="Rechercher des étudiants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredData.length === 0 && (
        <div className="title">Aucun étudiant n'est disponible.</div>
      )}
      {filteredData.length > 0 && (
        <>
          <div className="AddStudentToTeacher_error"></div>

          <div className="AddStudentToTeacher_wrapper">
            {filteredData.map((item) => (
              <StudentCard
                key={item.id}
                data={item}
                handelClick={handelClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AddStudentToTeacher;
