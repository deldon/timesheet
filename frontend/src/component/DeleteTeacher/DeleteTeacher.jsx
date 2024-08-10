import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";

import "./style.scss";

function DeleteStudent({ deleteHandelClose, id }) {
  const [httpError, setHttpError] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.DeleteTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries(["InvisibleTeacher"]);
      deleteHandelClose();
    },
    onError: (error) => {
      setHttpError(error.response.data.error);
    },
  });

  const deleteSignature = () => {
    mutation.mutate(id);
  };

  return (
    <>
      {httpError && <p className="delete_http_error">{httpError}</p>}

      {!httpError && (
        <>
          <div className="delete_signature_header">
            <p className="alest">
              Attention, la suppression d'un professeurs entraîne la suppression
              des émargements associés !
            </p>
            <p>Confirmez-vous la suppression ?</p>
          </div>
          <div className="delete_signature_footer">
            <div
              onClick={deleteSignature}
              className="delete_signature_footer_box"
            >
              OUI
            </div>
            <div
              onClick={deleteHandelClose}
              className="delete_signature_footer_box"
            >
              NON
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DeleteStudent;
