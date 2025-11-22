import './index.css';
import { UserAvatar } from "@/components/UserAvatar";
import { ReactSVG } from "react-svg";
import { useState } from 'react';

import Arrow from '@/assets/images/arrow.svg';
import { useAppStore } from "@/stores/useAppStore.ts";
import { ExperienceBar } from "@/components/ExperienceBar.tsx";

const Header = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggle = () => {
		setIsCollapsed(!isCollapsed);
	};

	const { user } = useAppStore();
	if (!user) return null;

	const { name, level, xpInCurrentLevel, requiredXp } = user;

	return (
		<div id="header" className={isCollapsed ? "collapsed" : ""}>
			<div className="header-inner">
				<div className="flex items-start gap-6">
					<UserAvatar name={name} level={level} size="lg" />
					<div className="flex-1 space-y-4">
						<div>
							<h1>{name}</h1>
							<p className="text-muted-foreground">
								Путь к лучшей версии себя
							</p>
						</div>
						<ExperienceBar
							currentXp={xpInCurrentLevel}
							requiredXp={requiredXp}
							level={level}
						/>
					</div>
				</div>
			</div>
			<div className="toggle cursor-pointer" onClick={toggle}>
				<ReactSVG src={Arrow} />
			</div>
		</div>
	);
};

export default Header;
