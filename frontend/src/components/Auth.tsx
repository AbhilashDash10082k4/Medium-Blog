import React, { useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import type { signUpTypes } from "@abhilashdash/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

function Auth({ type }: {type: "signup" | "signin"}) {
  const [signUpInputs, setSignUpInputs] = useState<signUpTypes>({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  //when onClick the buttons, send request to the backend
  async function sendRequest(e: React.FormEvent) {
    e.preventDefault()
    console.log("button is clicked")
    //call the backend url and send it the post request
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signin" ? "signin" : "signup"}`,signUpInputs);

        console.log("response:  ",response);
      //take the jwt token from the authorization header from the response and set it in the localStorage so that eery time the user tries to access the blog point he sends the jwt token in headers
      const jwt = response.data.jwt;
      console.log("jwt: ",jwt)

      localStorage.setItem("token", jwt);

      navigate("/blogs");
    } catch (error) {

      alert("Signup not successful");

      console.log(error);
    }
  }
  return (
    <form onSubmit={sendRequest}>
      <div className="bg-[#121212] h-screen w-screen text-white flex justify-center items-center">
      <div className="flex flex-col bg-[#1C1C1C] md:w-[34%] sm:w-[50%]  max-h-fit rounded-xl  p-3">
        <div className="w-full ">
          <h1 className="text-3xl text-[#E0E0E0] text-center font-bold pt-3">
            {type == "signin"
              ? "Sign in to your existing account"
              : "Create an account"}
          </h1>
          <h3 className="text-md text-[#E0E0E0] text-center font-extralight">
            {type == "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span className="hover:cursor-pointer underline">
              {type == "signin" ? (
                <Link to={"/signup"}>Create One</Link>
              ) : (
                <Link to={"/signin"}>Login</Link>
              )}
            </span>
          </h3>
        </div>
        <div className="w-full  h-full mt-5 p-3 ">
          {type === "signin" ? (
            ""
          ) : (
            <Input
              placeholder="Enter your username"
              type="string"
              onChange={(e) =>
                setSignUpInputs({ ...signUpInputs, name: e.target.value })
              }
              heading="Username"
            />
          )}
          <Input
            placeholder="Enter your email"
            type="string"
            onChange={(e) =>
              setSignUpInputs({ ...signUpInputs, email: e.target.value })
            }
            heading="Email"
          />
          <Input
            placeholder="Enter your password"
            type="password"
            onChange={(e) =>
              setSignUpInputs({ ...signUpInputs, password: e.target.value })
            }
            heading="Password"
          />
          <div onClick={sendRequest} className="text-[#E0E0E0] hover:cursor-pointer bg-[black] flex justify-center max-w-full rounded-xl p-3 mt-3">
            <button type="submit">
              {type === "signin" ? "Sign In": "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </form>
  );
}

export default Auth;
