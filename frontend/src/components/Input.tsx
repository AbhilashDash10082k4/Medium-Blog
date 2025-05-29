import React, { type ChangeEvent } from "react";

interface inputTypes {
  placeholder: string;
  type: "string" | "email" | "password";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  heading: string
}
function Input({ placeholder, type, onChange, heading }: inputTypes) {
  return (
    <>
      <div className="w-full pb-3 pt-3">
        <label className="text-[#E0E0E0] pl-1">{heading}</label>
        <input
          placeholder={placeholder}
          type={type}
          className="text-[#E0E0E0] bg-[#121212] h-[70%] mt-3 w-full rounded-xl outline-none p-4"
          onChange={onChange}
        />
      </div>
    </>
  );
}
export default Input;
