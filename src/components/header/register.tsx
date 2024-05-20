import { componentIsHTMLElement } from "astro/runtime/server/render/dom.js";
import Alert from "../../components/global-native/alert";
import { useEffect, useRef, useState, type ReactHTMLElement } from "react";
import register from "../../api/user/post/register";

interface RegisterProps {
  // close: () => void;
}
type UsernameStates = "inuse" | "disused" | "null";
function RegisterComponent() {
  const formRef = useRef<HTMLFormElement>(null);
  const currentRequestRef = useRef<AbortController | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [username, setUsername] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const [errors, setErrors] = useState<{
    displayName: boolean;
    username: UsernameStates;
    password: boolean;
    passwordConfirmation: boolean;
  }>({
    displayName: false,
    username: "null",
    password: false,
    passwordConfirmation: false,
  });
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleDisplayNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setDisplayName(e.currentTarget.value);
  };

  const handleUsernameChange = async (e: React.FormEvent<HTMLInputElement>) => {
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }
    const value = e.currentTarget.value.replace(/\s/g, "");
    setUsername(value);
    if (value !== "") {
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        const response = await fetch(
          `${import.meta.env.PUBLIC_SERVER_URL}/api/user/register/${value}`,
          {
            method: "GET",
            signal: signal,
          }
        );
        const data = await response.json();
        if (data.success) {
          console.log("Este usuario no existe aún");
          setErrors((prev) => ({
            ...prev,
            username: "disused",
          }));
        } else {
          console.log("Este usuario ya existe :C");
          setErrors((prev) => ({
            ...prev,
            username: "inuse",
          }));
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          // La solicitud fue cancelada, no necesitas manejar este caso
        } else {
          console.log(error);
          // Manejo de errores de red u otros errores
        }
      } finally {
        controller.abort(); // Asegurarse de que la solicitud se cancele al finalizar
      }
      return;
    }
    setErrors((prev) => ({
      ...prev,
      username: "null",
    }));
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setErrors((prev) => ({ ...prev, password: false }));
    const value = e.currentTarget.value;
    setPassword(value);
  };

  const handlePasswordConfirmationChange = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(e.currentTarget.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (displayName && username && password && passwordConfirmation) {
      register(displayName, username, password);
    }
  };

  useEffect(() => {
    const usernameTimeout = setTimeout(() => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: username === "" ? "null" : prevErrors.username,
      }));
    }, 100);

    return () => clearTimeout(usernameTimeout);
  }, [username]);

  useEffect(() => {
    const passwordTimeout = setTimeout(() => {
      const hasError = password.length > 0 && password.length < 8;
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: hasError,
      }));
    }, 1500);

    return () => clearTimeout(passwordTimeout);
  }, [password]);

  useEffect(() => {
    if (password === "") {
      setErrors((prev) => ({ ...prev, passwordConfirmation: false }));
      return;
    }
    if (passwordConfirmation === "") {
      setErrors((prev) => ({ ...prev, passwordConfirmation: false }));
      return;
    }
    const passwordConfirmationTimeout = setTimeout(() => {
      const hasError = passwordConfirmation !== password || password === "";
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirmation: hasError,
      }));
    }, 1500);

    return () => clearTimeout(passwordConfirmationTimeout);
  }, [password, passwordConfirmation]);

  return (
    <div className=" h-full w-full">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex gap-3 flex-col mt-10 mx-14">
          <div>
            <label
              className="ml-2 dark:text-white"
              htmlFor="display_name-input"
            >
              Display name
            </label>
            <input
              required
              minLength={1}
              maxLength={50}
              className="bg-transparent ring-2 ring-neutral-300 dark:ring-neutral-700 dark:text-white placeholder:text-neutral-500 px-4 py-3 rounded-xl w-full outline-blue-500 mt-1"
              placeholder="Display name"
              type="text"
              name="display_name-register"
              // id="display_name-input"
              value={displayName}
              onInput={handleDisplayNameChange}
            />
          </div>
          <div>
            <label className="ml-2 dark:text-white" htmlFor="username-input">
              Username
            </label>
            <input
              ref={inputRef}
              style={{
                outline:
                  errors.username === "inuse"
                    ? "2px red solid"
                    : errors.username === "disused"
                    ? "2px green solid"
                    : "none",
              }}
              required
              className="bg-transparent ring-2 ring-neutral-300 dark:ring-neutral-700 dark:text-white placeholder:text-neutral-500 px-4 py-3 rounded-xl w-full outline-blue-500 mt-1"
              placeholder="Username"
              type="text"
              name="username-register"
              // id="username-input"
              value={username}
              onChange={handleUsernameChange}
              onKeyDown={(e) => {
                if (e.key === " ")
                  Alert(
                    "bottom",
                    1500,
                    "danger",
                    "Cannot use space key",
                    `use "_"`
                  );
              }}
            />
            {errors.username === "inuse" && username.length > 0 && (
              <p className="text-red-500 font-semibold text-sm mt-2">
                The username {username} is already in use
              </p>
            )}

            {errors.username === "disused" && (
              <p className="text-green-500 font-semibold text-sm mt-2">
                This username is not used yet
              </p>
            )}
          </div>
          <div className="relative flex flex-col">
            <label className="ml-2 dark:text-white" htmlFor="password-input">
              Password
            </label>
            <input
              style={{ outline: errors.password ? " 2px red solid" : "none" }}
              minLength={8}
              maxLength={50}
              required
              className="bg-transparent ring-2 ring-neutral-300 dark:ring-neutral-700 dark:text-white placeholder:text-neutral-500 px-4 py-3 rounded-xl w-full outline-blue-500 mt-1"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              // id="password-input"
              name="password-register"
              value={password}
              onInput={handlePasswordChange}
            />
            {/* button */}
            <div
              onClick={togglePasswordVisibility}
              className="dark:text-white dark:hover:bg-neutral-700 w-fit h-fit p-2 rounded-full absolute right-3 top-9 cursor-pointer"
            >
              {!showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"
                  />
                </svg>
              )}
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 font-semibold mt-2">
                The password must be greater than 8 digits.
              </p>
            )}
          </div>
          <div className="relative flex flex-col">
            <label
              className="ml-2 dark:text-white"
              htmlFor="password-confirmation-input"
            >
              Confirm password
            </label>
            <input
              style={{
                outline: errors.passwordConfirmation
                  ? " 2px red solid"
                  : "none",
              }}
              minLength={8}
              maxLength={50}
              required
              className="bg-transparent ring-2 ring-neutral-300 dark:ring-neutral-700 dark:text-white placeholder:text-neutral-500 px-4 py-3 rounded-xl w-full outline-blue-500 mt-1"
              placeholder="Confirm password"
              type={showPassword ? "text" : "password"}
              // id="password-confirmation-input"
              name="password_confirmation-register"
              value={passwordConfirmation}
              onInput={handlePasswordConfirmationChange}
            />
            {/* button */}
            <div
              onClick={togglePasswordVisibility}
              className="dark:text-white dark:hover:bg-neutral-700 w-fit h-fit p-2 rounded-full absolute right-3 top-9 cursor-pointer"
            >
              {!showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"
                  />
                </svg>
              )}
            </div>
            {errors.passwordConfirmation && (
              <p className="text-sm mt-2 font-semibold text-red-500">
                Passwords is not match
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white w-full rounded-full py-3 mt-5 font-semibold text-xl hover:shadow-xl hover:shadow-red-500/20 transition-shadow "
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterComponent;
