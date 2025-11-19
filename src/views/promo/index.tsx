import './index.css';

import TasksList from "@/components/Tasks";

export default function Index() {

  const afterComplete = (id: number) => {
    console.log(id)
  }

  return (
    <div id='promo-view'>
      <TasksList afterComplete={afterComplete}></TasksList>
    </div>
  );
}
