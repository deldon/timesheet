import { useQuery, useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";

import "./style.scss";

function DeleteSignature({deleteHandelClose,id }) {
    const queryClient = useQueryClient();
    const mutation = useMutation(requestMutation.deleteSignature,{
        onSuccess:() => queryClient.invalidateQueries(['mycours']),
    });

    const deleteSignature = ()=>{
        mutation.mutate(id);
        deleteHandelClose()
    }

  return (
    <div className="delete">
    <div className="delete_signature">
     <div className="delete_signature_header">
     Voulez-vous supprimer ce cours ?
     </div>
     <div className="delete_signature_footer">
        <div onClick={deleteSignature} className="delete_signature_footer_box">
            OUI
        </div>
        <div onClick={deleteHandelClose} className="delete_signature_footer_box">
            NON
        </div>
     </div>
    </div>
    </div>
  );
}

export default DeleteSignature;
