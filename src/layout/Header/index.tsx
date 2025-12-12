import './index.css';
import {Profile} from "@/components/Profile.tsx";


const Header = () => {
	return (
		<div id="header">
			<div className="header-inner">
				<Profile></Profile>
			</div>
		</div>
	);
};

export default Header;
