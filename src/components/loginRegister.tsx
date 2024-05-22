import Tabs from "./global-react/tabs";
import LoginComponent from "./header/login";
import RegisterComponent from "./header/register";

function LoginRegister() {
  const tabs = [
    { label: "Login", content: <LoginComponent /> },
    { label: "Register", content: <RegisterComponent /> },
  ];
  return (
    <Tabs className="mt-5 px-5 md:px-10 lg:px-20 xl:px-32 gap-5" size="xl" rounded="full" full="full" tabs={tabs} />
  );
}
export default LoginRegister;
