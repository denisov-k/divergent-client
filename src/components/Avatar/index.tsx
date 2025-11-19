import { useAuth } from "@/hooks/use-auth"
import './index.css';
import {useNavigate} from "react-router-dom";

export default function () {
  const { user } = useAuth();
  const navigate = useNavigate()

  const onClick = () => {
    navigate('/profile');
  }

  return (
    <div id="avatar">
      <div onClick={onClick} className="cursor-pointer">
        <div className="avatar">
          <img src={user?.photo_url || "/avatar.png"}  alt="Avatar" />
        </div>
        <div className="name">
          {user?.name}
        </div>
      </div>
      <div>
        <div className="balance">
          {user?.balance?.toFixed(2)} <span>$</span>
        </div>
      </div>
    </div>
  );
}
