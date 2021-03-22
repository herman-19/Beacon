import React, { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import config from "../config";

const Login = ({ loginDisplayed }) => {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();
  const history = useHistory();

  const onSubmit = async (data, e) => {
    try {
      const res = await axios.post(`${config.baseUrl}/api/auth`, data, {
        headers: { "Content-Type": "application/json" },
      });
      localStorage.setItem("token", res.data.token);
      setMessage({ info: `Logging in...`, type: `success` });
      e.target.reset();
      setTimeout(() => {
        history.push("/dashboard");
      }, 1000);
    } catch (error) {
      const errMsg = error.response.data.errors[0].msg;
      setMessage({ info: `${errMsg}`, type: `warning` });
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
