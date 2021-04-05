import React, { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { userLogin } from "../api/UserAPI";

const Login = ({ loginDisplayed }) => {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();
  const history = useHistory();

  const onSubmit = async (loginCredentials, e) => {
    try {
      const data = await userLogin(loginCredentials);
      localStorage.setItem("token", data.token);
      setMessage({ info: `Logging in...`, type: `success` });
      e.target.reset();
      setTimeout(() => {
        history.push("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage({ info: `${error}`, type: `warning` });
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          name="email"
          ref={register({
            required: "Email is required.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Enter a valid e-mail address",
            },
          })}
          placeholder="Email Address"
        />
        {errors.email && <h5 className="error">{errors.email.message}</h5>}
        <input
          type="password"
          name="password"
          ref={register({
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Must exceed 6 characters.",
            },
          })}
          placeholder="Password"
        />
        {errors.password && (
          <h5 className="error">{errors.password.message} </h5>
        )}
        {message && (
          <div>
            <h5 className={`${message.type}`}>{message.info}</h5>
          </div>
        )}
        <button type="submit">Log In</button>
      </form>
      <hr />
      <button
        onClick={() => {
          loginDisplayed(false);
        }}
      >
        Sign Up
      </button>
    </Fragment>
  );
};

export default Login;
