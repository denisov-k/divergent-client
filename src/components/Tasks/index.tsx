import { useState, useEffect } from 'react';
import {ReactSVG} from "react-svg";
import Service from '@/services/Tasks.ts';
import { useTranslation } from 'react-i18next';
import './index.css';

import xIcon from '@/assets/images/tasks/x.svg';
import telegramIcon from '@/assets/images/tasks/telegram.svg';
import instagramIcon from '@/assets/images/tasks/instagram.svg';
import youtubeIcon from '@/assets/images/tasks/youtube.svg';

import doneIcon from '@/assets/images/tasks/done.svg';
// import coinIcon from '@/assets/images/tasks/coin.svg';
// import coinIcon from '@/assets/images/wallet/dollar.svg';

interface IconListType {
  [key: string]: string; // Allows any string as a key, with values of type 'any'
}

const icons: IconListType = {
  x: xIcon,
  telegram: telegramIcon,
  instagram: instagramIcon,
  youtube: youtubeIcon,
};

interface TaskType {
  id: number
  link: string
  completed: boolean
  type: string
  reward: number
  name: string
}

interface MyComponentProps {
  afterComplete: (id: number) => void;
}

const TasksList = ({ afterComplete }: MyComponentProps) => {
  const [tasksInProgress, setTasksInProgress] = useState<number[]>([]);
  const [tasksList, setTasksList] = useState<TaskType[]>([]);
  const { t } = useTranslation();

  useEffect( () => {
    const fetchData = async () => {
      const tasks = await Service.getList();
      setTasksList(tasks);
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const startTask = (index: number) => {
    setTimeout(() => {
      setTasksInProgress([...tasksInProgress, index]);
    }, 1000);

    // @ts-ignore
    Telegram.WebApp.openLink(tasksList[index].link);
  };

  const claimTask = (index: number) => {
    const taskId = tasksList[index].id;

    Service.complete(taskId).then(() => {
      const updatedTasks = [...tasksList];
      updatedTasks[index].completed = true;
      setTasksList(updatedTasks);


      // @ts-ignore
      Telegram.WebApp.HapticFeedback.notificationOccurred("success");
      afterComplete(index);
    });
  };

  return (
    <div id="tasks-list">
      {tasksList.map((task, index) => (
        <div className="task-item" key={task.id}>
          <ReactSVG src={icons[task.type]} className="icon" />

          <div className="captions">
            <div>
              <div>{task.name}</div>
            </div>
            <div>
              <span className="dollar">$</span>
              <div className="reward">+ {task.reward}</div>
            </div>
          </div>
          {task.completed ? (
            <div className="button completed">
              <ReactSVG
                src={doneIcon}
                className="completed-icon"
              />
            </div>
          ) : !tasksInProgress.includes(index) ? (
            <div className="button start" onClick={() => startTask(index)}>
              {t('tasks.start')}
            </div>
          ) : (
            <div className="button claim" onClick={() => claimTask(index)}>
              {t('tasks.complete')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TasksList;
