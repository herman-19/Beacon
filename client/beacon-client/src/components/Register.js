import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const Register = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <div className="landing-box">
      <h1>Beacon</h1>
      <p>Help your friends and family</p>
      <p>—and let them help you!</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          name="name"
          ref={register({ required: "Name is required." })}
          placeholder="Name"
        />
        <ErrorMessage errors={errors} name="name" as="h5" />
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
          placeholder="E-mail"
        />
        {errors.email && <h5 className="error">{errors.email.message}</h5>}
        <input
          type="password"
          name="password"
          ref={register({
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Must exceed 8 characters.",
            },
          })}
          placeholder="Password"
        />
        {errors.password && (
          <h5 className="error">{errors.password.message} </h5>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
