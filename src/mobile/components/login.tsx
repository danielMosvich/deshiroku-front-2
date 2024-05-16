import LoginComponent from "../../components/header/login";
import { useState } from "react";

function MobileLogin() {
  const [active, setActive] = useState(true);
  return (
    <div>
      <LoginComponent close={() => setActive(false)} />
    </div>
  );
}
export default MobileLogin;
