import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FriendCard } from "@/components/FriendCard";
import { Button } from "@/components/ui/button";
import { useFrensScreen } from "@/shared/screens/frens/useFrensScreen";

export default function FrensScreen() {
  const { t } = useTranslation();
  const { friends } = useFrensScreen();

  return (
    <div className="flex flex-1 flex-col px-2">
      <div className="flex items-center justify-between py-2">
        <h2>{t("frens.title")}</h2>
        <Button disabled>
          <Plus className="mr-2 size-4" />
          {t("frens.add")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 overflow-auto">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="
              w-full
              md:basis-[calc(50%-0.5rem)]
              lg:basis-[calc(33.333%-0.5rem)]
              xl:basis-[calc(25%-0.5rem)]
            "
          >
            <FriendCard {...friend} />
          </div>
        ))}
      </div>
    </div>
  );
}
