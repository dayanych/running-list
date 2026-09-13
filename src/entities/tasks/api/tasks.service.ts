import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { firebaseDb } from '@/shared/config/firebase.config';
import {
  PATH_TO_STATES_COLLECTION,
  PATH_TO_TASKS_COLLECTION,
} from '@/shared/models/constants/firebase-paths';

import { TaskDto } from './dto/task.dto';

type TaskDtoWithoutId = Omit<TaskDto, 'id'>;

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

  public static async deleteTask(
    taskId: string,
    userId: string,
  ): Promise<void> {
    const taskDocRef = doc(firebaseDb, PATH_TO_TASKS_COLLECTION, taskId);
    const statesCollectionRef = collection(
      firebaseDb,
      PATH_TO_STATES_COLLECTION,
    );
    // The owner filter keeps this query valid under a rule that limits states
    // to their user_id
    const statesSnapshots = await getDocs(
      query(
        statesCollectionRef,
        where('task_id', '==', taskId),
        where('user_id', '==', userId),
      ),
    );

    await runTransaction(firebaseDb, async (transaction) => {
      statesSnapshots.docs.forEach((stateDoc) => {
        transaction.delete(stateDoc.ref);
      });

      transaction.delete(taskDocRef);
    });
  }
}
