import "./style.scss";
import { useMutation, useQueryClient } from "react-query";

import requestMutation from "../../request/mutation/request";

import { useForm } from "react-hook-form";

function EditeTeacher({ data, Close }) {
  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.updateTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries(["AllTeacher"]);
      Close();
    },
    onError: (e) => {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      teacher_id: data.id,
      lastname: data.lastname,
      firstname: data.firstname,
      email: data.email,
      is_admin: data.is_admin,
    },
  });

  const onSubmit = (e) => {
    mutation.mutate(e);
  };

  return (
    <form className="post-signature-form" onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="add_teacher_error">{error}</div> */}
      <input type="hidden" {...register("teacher_id")} />
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

      <div className="post-signature-form-box">
        <label>Email</label>
        <input
          type="email"
          className={errors.signature_date?.type === "required" && "red"}
          {...register("email", { required: true })}
          aria-invalid={errors.signature_date ? "true" : "false"}
        />
      </div>

      <div className="post-signature-form-box">
        <label>Admin</label>
        <input
          type="checkbox"
          className={errors.signature_date?.type === "required" && "red"}
          {...register("is_admin")}
          aria-invalid={errors.signature_date ? "true" : "false"}
        />
      </div>

      <input type="submit" />
    </form>
  );
}

export default EditeTeacher;
