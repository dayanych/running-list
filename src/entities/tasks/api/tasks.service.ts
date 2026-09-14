import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { firebaseDb } from '@/shared/config/firebase.config';
import {
  PATH_TO_STATES_COLLECTION,
  PATH_TO_TASKS_COLLECTION,
} from '@/shared/models/constants/firebase-paths';

import { TaskDto } from './dto/task.dto';

type TaskDtoWithoutId = Omit<TaskDto, 'id'>;

const MAX_BATCH_WRITES = 500;

export class TasksService {
  public static getTasksByUserIdYearWeek = async (
    userId: string,
    week: number,
    year: number,
  ): Promise<TaskDto[]> => {
    const tasksCollectionRef = collection(firebaseDb, PATH_TO_TASKS_COLLECTION);
    const tasksSnaphots = await getDocs(
      query(
        tasksCollectionRef,
        where('user_id', '==', userId),
        where('year', '==', year),
        where('week', '==', week),
        orderBy('order', 'asc'),
      ),
    );

    return tasksSnaphots.docs.map((taskDoc) => taskDoc.data() as TaskDto);
  };

  public static async createAndGetTask(
    taskDtoWithoutId: TaskDtoWithoutId,
  ): Promise<TaskDto> {
    const docRef = doc(collection(firebaseDb, PATH_TO_TASKS_COLLECTION));
    const taskDto: TaskDto = {
      ...taskDtoWithoutId,
      id: docRef.id,
    };

    await setDoc(docRef, taskDto);

    return taskDto;
  }

  public static async getTaskById(taskId: string): Promise<TaskDto> {
    const taskDocRef = doc(firebaseDb, PATH_TO_TASKS_COLLECTION, taskId);
    const taskDoc = await getDoc(taskDocRef);

    return taskDoc.data() as TaskDto;
  }

  public static async updateTask(taskDto: TaskDto): Promise<void> {
    await updateDoc(doc(firebaseDb, PATH_TO_TASKS_COLLECTION, taskDto.id), {
      ...taskDto,
    });
  }

  /**
   * Deletes a task and then every state that belongs to it
   *
   * The task goes first so the state-creation rule rejects new states for it
   * before the states query runs; a retry after a failed state cleanup skips
   * the missing task and finishes the cascade
   *
   * @param taskId - Task to delete
   * @param userId - Owner of the task and its states
   */
  public static async deleteTask(
    taskId: string,
    userId: string,
  ): Promise<void> {
    const taskDocRef = doc(firebaseDb, PATH_TO_TASKS_COLLECTION, taskId);
    const taskDoc = await getDoc(taskDocRef);

    if (taskDoc.exists()) {
      await deleteDoc(taskDocRef);
    }

    // The owner filter keeps this query valid under a rule that limits states
    // to their user_id
    const statesSnapshots = await getDocs(
      query(
        collection(firebaseDb, PATH_TO_STATES_COLLECTION),
        where('task_id', '==', taskId),
        where('user_id', '==', userId),
      ),
    );

    for (
      let index = 0;
      index < statesSnapshots.docs.length;
      index += MAX_BATCH_WRITES
    ) {
      const batch = writeBatch(firebaseDb);

      statesSnapshots.docs
        .slice(index, index + MAX_BATCH_WRITES)
        .forEach((stateDoc) => batch.delete(stateDoc.ref));

      await batch.commit();
    }
  }
}
