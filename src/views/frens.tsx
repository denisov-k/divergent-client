import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FriendCard } from "@/components/FriendCard";

import { useAppStore } from "@/stores/useAppStore";

export default function Friends() {
  const { friends } = useAppStore();

  return (
    <div className="flex flex-col px-2 flex-1">
      <div className="flex items-center justify-between py-2">
        <h2>Друзья и лидеры</h2>
        <Button disabled>
          <Plus className="size-4 mr-2" />
          Добавить друга
        </Button>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-auto">
        {friends.map((friend) => (
          <FriendCard key={friend.id} {...friend} />
        ))}
      </div>
    </div>
  );
}
