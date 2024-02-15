import React, { useState, useContext } from "react";

import "./Auth.css";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/components/context/auth-context";
const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formstate, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(formstate.inputs);
    if (isLoginMode) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_API_URL + "/api/users/login",
          "POST",
          JSON.stringify({
            email: formstate.inputs.email.value,
            password: formstate.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        // console.log(response);
        auth.login(response.userId, response.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formstate.inputs.email.value);
        formData.append("password", formstate.inputs.password.value);
        formData.append("name", formstate.inputs.name.value);
        formData.append("image", formstate.inputs.image.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL + "/api/users/signup",
          "POST",
          formData
        );

        // console.log(responseData);

        auth.login(responseData.userId, responseData.token);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formstate.inputs,
          name: undefined,
          Image: undefined,
        },
        formstate.inputs.email.isValid && formstate.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formstate.inputs,
          name: { value: "", isValid: false },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter valid name"
              onInput={inputHandler}
            ></Input>
          )}
          {!isLoginMode && (
            <ImageUpload center id="image" onInput={inputHandler} />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="please enter valid email-id"
            onInput={inputHandler}
          ></Input>
          <Input
            element="input"
            id="password"
            type="passsword"
            label="password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="please enter valid PASSWORD"
            onInput={inputHandler}
          ></Input>
          <Button type="submit" disabled={!formstate.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          switch to {!isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
