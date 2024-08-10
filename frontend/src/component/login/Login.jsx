import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import "./style.scss";
import { setToken } from "../../request/axios";

import request from "../../request/mutation/request";

import logo from "./logo.png";

function Login({ setIsLogged, setUser }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const mutation = useMutation(request.login);

  if (mutation.isSuccess) {
    setToken(mutation.data.headers.authorization);
    setIsLogged(false);
    setUser(mutation.data.data.user);
  }

  return (
    <>
      <div className="login">
        <img className="login_logo" src={logo} alt="" />
        <form className="login_form" onSubmit={handleSubmit(onSubmit)}>
          {mutation.isError ? (
            <div className="login_form_error">
              {mutation.error.response.data.error}
            </div>
          ) : null}

          <div className="login_form_box">
            <label>Email</label>
            <input
              className="login_form_input"
              type="email"
              {...register("email", { required: true })}
            />
          </div>
          <div className="login_form_box">
            <label>Password</label>
            <input
              className="login_form_input"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.email && <span>email is required</span>}
            {errors.password && <span>password is required</span>}
          </div>

          <input className="login_form_submit" type="submit" />
        </form>
      </div>
    </>
  );
}

export default Login;