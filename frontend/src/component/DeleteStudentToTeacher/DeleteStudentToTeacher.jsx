// DeleteStudentToTeacher
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";

import "./style.scss";

function DeleteStudentToTeacher({ Close, id }) {
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.DeleteStudentToTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries(["AllTeacher"]);
      Close();
    },
    onError: (e) => {
      setError(e.response.data.error);
    },
  });

  const deleteSignature = () => {
    mutation.mutate(id);
  };

  return (
    <>
      <div className="supr_teacher_erroe">{error}</div>
      <div className="delete_signature_header">Voulez-vous supprimer ?</div>
      <div className="delete_signature_footer">
        <div onClick={deleteSignature} className="delete_signature_footer_box">
          OUI
        </div>
        <div onClick={Close} className="delete_signature_footer_box">
          NON
        </div>
      </div>
    </>
  );
}

export default DeleteStudentToTeacher;
