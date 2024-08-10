import "./style.scss";
import { useQuery, useMutation, useQueryClient } from "react-query";
import request from "../../request/query/request";
import requestMutation from "../../request/mutation/request";
import Spinner from "../Spinner/Spinner";

import { useForm } from "react-hook-form";

import dayjs from "dayjs";

function EditeStudent({ toggelEditId, toggelHandelClose }) {
  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.updateStudent, {
    onSuccess: () => queryClient.invalidateQueries(["AllStudent"]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      lastname: toggelEditId.lastname,
      firstname: toggelEditId.firstname,
      studentId: toggelEditId.id,
    },
  });

  const onSubmit = (e) => {
    mutation.mutate(e);
    toggelHandelClose();
  };

  return (
    <form className="post-signature-form" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />

      <div className="post-signature-form-box">
        <label>Nom</label>
        <input
          type="text"
          className={errors.signature_date?.type === "required" && "red"}
          {...register("lastname", { required: true })}
          aria-invalid={errors.signature_date ? "true" : "false"}
        />
      </div>

      <div className="post-signature-form-box">
        <label>Prénom</label>
        <input
          type="text"
          className={errors.signature_date?.type === "required" && "red"}
          {...register("firstname", { required: true })}
          aria-invalid={errors.signature_date ? "true" : "false"}
        />
      </div>

      <input type="submit" />
    </form>
  );
}

export default EditeStudent;
