import "./style.scss";
import { useMutation, useQueryClient } from "react-query";
import requestMutation from "../../request/mutation/request";
import { useForm } from "react-hook-form";
import { useState } from "react";

function PostTeacher({ close }) {
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.newTeacher, {
    onSuccess: () => {
      queryClient.invalidateQueries(["AllTeacher"]);
      close();
    },
    onError: (e) => {
      setError(e.response.data.error);
    },
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
  };

  return (
    <form className="post-signature-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="add_teacher_error">{error}</div>
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
        <label>Password</label>
        <input
          type="password"
          className={errors.signature_date?.type === "required" && "red"}
          {...register("password", { required: true })}
          aria-invalid={errors.signature_date ? "true" : "false"}
        />
      </div>

      <div className="post-signature-form-box">
        <label>Admin</label>
        <input
          type="checkbox"
          className={errors.signature_date?.type === "required" && "red"}
          {...register("isAdmin")}
          aria-invalid={errors.signature_date ? "true" : "false"}
        />
      </div>

      <input type="submit" />
    </form>
  );
}

export default PostTeacher;
