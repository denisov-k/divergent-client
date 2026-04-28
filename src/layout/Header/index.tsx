import "./index.css";
import { Profile } from "@/components/web/layout/Profile.tsx";

const Header = () => {
  return (
    <div id="header">
      <div className="header-inner">
        <Profile />
      </div>
    </div>
  );
};

export default Header;
