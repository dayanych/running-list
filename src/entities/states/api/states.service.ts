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

export class StatesService {
  public static getStateById = async (stateId: string) => {
    const state = await getDoc(
      doc(firebaseDb, PATH_TO_STATES_COLLECTION, stateId),
    );

    return state.data() as StateDto;
  };

  /**
   * Loads a user's states whose calendar day falls within a range
   *
   * Needs the composite index `user_id ASC, date_key ASC` on `states` and
   * never matches documents lacking either field; the `migrate:states` script
   * creates that index and backfills legacy states
   *
   * @param userId - Owner of the states
   * @param fromDateKey - First day, inclusive, in `yyyy-MM-dd` form
   * @param toDateKey - Last day, inclusive, in `yyyy-MM-dd` form
   * @returns States of the user within the range
   */
  public static getStatesByUserIdDateRange = async (
    userId: string,
    fromDateKey: string,
    toDateKey: string,
  ): Promise<StateDto[]> => {
    const statesSnapshots = await getDocs(
      query(
        collection(firebaseDb, PATH_TO_STATES_COLLECTION),
        where('user_id', '==', userId),
        where('date_key', '>=', fromDateKey),
        where('date_key', '<=', toDateKey),
      ),
    );

    return statesSnapshots.docs.map((stateDoc) => stateDoc.data() as StateDto);
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
