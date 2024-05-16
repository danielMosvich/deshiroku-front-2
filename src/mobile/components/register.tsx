import RegisterComponent from "../../components/header/register";
// import LoginComponent from "../../components/header/login";
import { useState } from "react";

function MobileRegister() {
  const [active, setActive] = useState(true);
  return (
    <div>
      <RegisterComponent close={() => setActive(false)} />
    </div>
  );
}
export default MobileRegister;
