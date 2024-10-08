/** @format */

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";

export default function TextInput({
  type = "text",
  name,
  id = "",
  value = "",
  className = "",
  autoComplete,
  required,
  isFocused,
  handleChange,
  placeholder,
  altInput = false,
  disabled = false,
}) {
  const input = useRef();
  const [viewType, setViewType] = useState(type === "password");
  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-start ">
      <input
        id={id}
        type={type === "password" ? (viewType ? "password" : "text") : type}
        name={name}
        value={value}
        className={`shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        ref={input}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
      />

      {type == "password" && (
        <div
          className={`w-full ${className} -mt-7 flex flex-row-reverse text-right`}
        >
          <div
            className="z-20 px-1 mx-2 bg-white cursor-pointer"
            onClick={() => setViewType((pre) => !pre)}
          >
            {viewType ? (
              <EyeSlashIcon className="z-20 w-5 h-5 text-latisGray-800" />
            ) : (
              <EyeIcon className="z-20 w-5 h-5 text-latisGray-800" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
