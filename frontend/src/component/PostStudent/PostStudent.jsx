import "./style.scss";
import { useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";
import { useForm } from "react-hook-form";

function PostStudent({ toggelHandelClose }) {
  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.newStudent, {
    onSuccess: () => queryClient.invalidateQueries(["AllStudent"]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = (e) => {
    mutation.mutate(e);
    toggelHandelClose();
  };

  return (
    <form className="post-signature-form" onSubmit={handleSubmit(onSubmit)}>
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

export default PostStudent;
