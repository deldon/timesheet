import "./style.scss";
import { useState } from "react";
import Titel from "../Title/Title";
import Spinner from "../Spinner/Spinner";

import { useForm } from "react-hook-form";

import { useMutation } from "react-query";
import requestMutation from "../../request/mutation/request";

function Profile({ disconnect }) {
  const [error, setError] = useState("");

  const mutation = useMutation(requestMutation.updatePassword, {
    onSuccess: (e) => {
      disconnect();
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
    <div className="profile">
      <Titel text="Mon profil" />
      <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="profile-form-box">
          <label>Ancien mot de passe</label>
          <input
            type="password"
            className={errors.oldPassword?.type === "required" && "red"}
            {...register("oldPassword", { required: true })}
            aria-invalid={errors.oldPassword ? "true" : "false"}
          />
        </div>

        <div className="profile-form-box">
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            className={errors.newPassword?.type === "required" && "red"}
            {...register("newPassword", { required: true })}
            aria-invalid={errors.newPassword ? "true" : "false"}
          />
        </div>
        {error}
        <input className="profile-form-submit" type="submit" />
      </form>
    </div>
  );
}

export default Profile;
