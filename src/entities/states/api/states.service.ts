import {
  collection,
  deleteDoc,
  doc,
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

export class StatesService {
  public static getStatesByTaskId = async (
    taskId: string,
  ): Promise<StateDto[]> => {
    const statesCollectionRef = collection(
      firebaseDb,
      PATH_TO_STATES_COLLECTION,
    );
    const statesSnaphots = await getDocs(
      query(statesCollectionRef, where('task_id', '==', taskId)),
    );

    return statesSnaphots.docs.map((stateDoc) => stateDoc.data() as StateDto);
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
