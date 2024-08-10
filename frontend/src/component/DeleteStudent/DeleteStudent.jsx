import { useQuery, useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";

import "./style.scss";

function DeleteStudent({deleteHandelClose,id }) {
    const queryClient = useQueryClient();
    const mutation = useMutation(requestMutation.deleteStudent,{
        onSuccess:() => queryClient.invalidateQueries(['VisibleStudent']),
    });

    const deleteSignature = ()=>{
        mutation.mutate(id);
        deleteHandelClose()
    }

  return (
<>
     <div className="delete_signature_header">
        <p className="alest">Attention, la suppression d'un élève entraîne la suppression des émargements associés !</p>
        <p>Confirmez-vous la suppression ?</p>
   
     </div>
     <div className="delete_signature_footer">
        <div onClick={deleteSignature} className="delete_signature_footer_box">
            OUI
        </div>
        <div onClick={deleteHandelClose} className="delete_signature_footer_box">
            NON
        </div>
     </div>
     </>
  );
}

export default DeleteStudent;