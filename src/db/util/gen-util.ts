import ErrorMessageConstants from 'src/app/constants/error-message.constants';
import GenConst from 'src/app/constants/gen-constant';
import { UserRole } from '../enum';

export default class GenUtil {
  static getOffsetAndLimit(
    page: number | string,
    pageSize = GenConst.PaginationLimit,
  ): { skip: number; take: number } {
    page = Number(page);
    const skip = (page < 1 ? 0 : page - 1) * pageSize;
    const take = pageSize;
    return { skip, take };
  }

  static isClientAllowed = (role: string) => {
    if (role === UserRole.CLIENT) {
      return false;
    }
    return true;
  };
}
