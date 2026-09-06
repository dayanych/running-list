import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { firebaseDb } from '@/shared/config/firebase.config';
import { PATH_TO_STATES_COLLECTION } from '@/shared/models/constants/firebase-paths';

import { StateDto } from './dto/state.dto';

type StateDtoWithoutId = Omit<StateDto, 'id'>;

/** Maximum number of values Firestore accepts in a single `in` filter */
const IN_FILTER_CHUNK_SIZE = 30;

/**
 * Splits ids into groups that fit into one Firestore `in` filter
 *
 * @param taskIds - Task ids to split
 * @returns Chunks of at most `IN_FILTER_CHUNK_SIZE` ids each
 */
const chunkTaskIds = (taskIds: string[]): string[][] => {
  const chunks: string[][] = [];

  for (let i = 0; i < taskIds.length; i += IN_FILTER_CHUNK_SIZE) {
    chunks.push(taskIds.slice(i, i + IN_FILTER_CHUNK_SIZE));
  }

  return chunks;
};

export class StatesService {
  public static getStateById = async (stateId: string) => {
    const state = await getDoc(
      doc(firebaseDb, PATH_TO_STATES_COLLECTION, stateId),
    );

    return state.data() as StateDto;
  };

  /**
   * Loads states for several tasks at once
   *
   * Firestore caps an `in` filter at 30 values, so larger id lists are fetched
   * as parallel chunked queries instead of one request per task
   *
   * @param taskIds - Ids of the tasks whose states are needed
   * @returns Flat list of states belonging to any of the given tasks
   */
  public static getStatesByTaskIds = async (
    taskIds: string[],
  ): Promise<StateDto[]> => {
    if (taskIds.length === 0) {
      return [];
    }

    const statesCollectionRef = collection(
      firebaseDb,
      PATH_TO_STATES_COLLECTION,
    );

    const chunkSnapshots = await Promise.all(
      chunkTaskIds(taskIds).map((chunk) =>
        getDocs(query(statesCollectionRef, where('task_id', 'in', chunk))),
      ),
    );

    return chunkSnapshots.flatMap((statesSnapshots) =>
      statesSnapshots.docs.map((stateDoc) => stateDoc.data() as StateDto),
    );
  };

  public static async createAndGetState(
    stateWithoutIdDto: StateDtoWithoutId,
  ): Promise<StateDto> {
    const docRef = doc(collection(firebaseDb, PATH_TO_STATES_COLLECTION));
    const stateDto: StateDto = {
      ...stateWithoutIdDto,
      id: docRef.id,
    };

    await setDoc(docRef, stateDto);

    return stateDto;
  }

  public static async updateState(stateDto: StateDto): Promise<void> {
    await updateDoc(doc(firebaseDb, PATH_TO_STATES_COLLECTION, stateDto.id), {
      ...stateDto,
    });
  }

  public static async deleteState(stateId: string): Promise<void> {
    await deleteDoc(doc(firebaseDb, PATH_TO_STATES_COLLECTION, stateId));
  }
}
