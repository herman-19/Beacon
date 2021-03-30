import React, { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { userRegistration } from "../api/UserAPI";

const Register = ({ loginDisplayed }) => {
  const { register, handleSubmit, errors } = useForm();
  const [message, setMessage] = useState();
  const history = useHistory();

  const onSubmit = async (registrationData, e) => {
    try {
      const data = await userRegistration(registrationData);
      localStorage.setItem("token", data.token);
      setMessage({ info: `Creating new account...`, type: `success` });
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
          name="name"
          ref={register({
            required: "Name is required.",
          })}
          placeholder="Name"
        />
        {errors.name && <h5 className="error">{errors.name.message}</h5>}
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
        <button type="submit">Sign Up</button>
      </form>
      <hr />
      <button
        onClick={() => {
          loginDisplayed(true);
        }}
      >
        Have an account? Log In
      </button>
    </Fragment>
  );
};

export default Register;
