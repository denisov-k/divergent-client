import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FriendCard } from "@/components/FriendCard";

import { useAppStore } from "@/stores/useAppStore";
import {useTranslation} from "react-i18next";

export default function Friends() {
  const { t } = useTranslation();
  const { friends } = useAppStore();

  return (
    <div className="flex flex-col px-2 flex-1">
      <div className="flex items-center justify-between py-2">
        <h2>{t('frens.title')}</h2>
        <Button disabled>
          <Plus className="size-4 mr-2"/>
          {t('frens.add')}
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
