import type { TokenProps } from "../../types/cookieProps";
import Alert from "../../components/global-native/alert";
import { useState } from "react";

interface LoginProps {
  close: () => void;
}
function LoginComponent({ close }: LoginProps) {
  const [show, setShow] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState(false);

  const toggleShow = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShow((prev) => !prev);
  };
  function handleUsername(e: React.FormEvent<HTMLInputElement>) {
    error && setError(false);
    const value = e.currentTarget.value;
    setUsername(value);
    // console.log(username)
  }
  function handlePassword(e: React.FormEvent<HTMLInputElement>) {
    error && setError(false);
    const value = e.currentTarget.value;
    setPassword(value);
    // console.log(password)
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (username !== "" && password !== "") {
      try {
        const url = import.meta.env.PUBLIC_SERVER_URL;
        const response = await fetch(`${url}/api/user/login`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
        const cookie = await response.json();
        if (!cookie.error) {
          const currentTime = new Date(); // <== tiempo actual

          const dataCookie = cookie as TokenProps;
          const expirationTime = dataCookie.access_token.expires_in; // <== una hora
          const expirationDate = new Date(
            currentTime.getTime() + expirationTime
          );
          const expirationDateString = expirationDate.toUTCString();
          const access_token = `token=${dataCookie.access_token.token}; expires=${expirationDateString}; path=/`;

          // * REFRESH TOKEN ---------
          const expirationTimeRefresh = dataCookie.refresh_token.expires_in;
          const expirationDateRefresh = new Date(
            currentTime.getTime() + expirationTimeRefresh
          );
          const expirationDateStringRefresh = expirationDateRefresh;
          const refresh_token = `refresh_token=${dataCookie.refresh_token.token}; expires=${expirationDateStringRefresh}; path=/`;

          // console.log(access_token, refresh_token);
          document.cookie = access_token;
          document.cookie = refresh_token;
          localStorage.setItem(
            "time",
            JSON.stringify({ expires_in: dataCookie.access_token.expires_in, current_time: new Date().getTime()})
          );

          // !LO QUE HACE UNA VEZ TENGA EL COOKIE XD
          close();
          window.location.reload();
          // !!! MOBILE ONLY
          // window.history.back()
        } else {
          setError(true);
          Alert(
            "bottom",
            2000,
            "danger",
            "the username or password is wrong",
            "please try again"
          );
        }
      } catch (error) {
        Alert(
          "bottom",
          2000,
          "error",
          "Server is not working now :(",
          "please try again later"
        );
      }
    }
  }
  return (
    <div
      className="fixed bg-black/40 w-full h-screen left-0 top-0 flex justify-center items-center"
      onClick={close}
    >
      <div
        className="bg-white dark:bg-neutral-800 max-w-lg w-full h-4/5 rounded-[30px] mx-auto p-5 relative z-40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <div
          className="absolute right-5 rounded-full hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-700 cursor-pointer"
          onClick={close}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="3rem"
            height="3rem"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z"
            />
          </svg>
        </div>
        {/* body */}
        <section className="text-3xl mx-5 font-semibold font-ui text-center text-neutral-700 dark:text-neutral-300 mt-20">
          <h2 className="">Welcome back to</h2>
          <h3 className="dark:text-white font-bold font-ui ">Deshiroku</h3>
        </section>
        <form onSubmit={onSubmit}>
          <div className="flex gap-3  flex-col mt-10 mx-14">
            <div>
              <label className="ml-2 dark:text-white" htmlFor="username-input">
                Username
              </label>
              <input
                required
                style={{ outline: error ? "red 2px solid" : "none" }}
                className="bg-transparent ring-2 ring-neutral-300 dark:ring-neutral-700 dark:text-white placeholder:text-neutral-500 px-4 py-3 rounded-xl w-full outline-blue-500 mt-1"
                placeholder="Username"
                type="text"
                name="username-register"
                id="username-input"
                value={username}
                onInput={handleUsername}
              />
            </div>
            <div className="relative flex flex-col">
              <label className="ml-2 dark:text-white" htmlFor="password-input">
                Password
              </label>
              <input
                style={{ outline: error ? "red 2px solid" : "none" }}
                className="bg-transparent ring-2 ring-neutral-300 dark:ring-neutral-700 dark:text-white placeholder:text-neutral-500 px-4 py-3 rounded-xl w-full  outline-blue-500 mt-1"
                placeholder="Password"
                type={show ? "text" : "password"}
                id="password-input"
                name="register-input"
                value={password}
                onInput={handlePassword}
              />
              <button
                onClick={toggleShow}
                className="absolute right-4 w-5 h-5 max-w-5 max-h-5 bottom-2 hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-700 rounded-full flex justify-center items-center p-4"
              >
                {show ? (
                  <i className="">
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
                  </i>
                ) : (
                  <i className="">
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
                  </i>
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-500 font-semibold text-sm">
                the username or password appears to be incorrect.
              </p>
            )}
            <button
              type="submit"
              className="bg-red-500 text-white w-full  rounded-full py-3 mt-5 font-semibold text-xl hover:shadow-xl hover:shadow-red-500/20 transition-shadow "
            >
              Login
            </button>
          </div>
          {/* <div className="mx-10">
            
          </div> */}
        </form>
      </div>
    </div>
  );
}
export default LoginComponent;
