import { BASE_LAND_ACRE_SIZE } from "../../constants/general";

export const calculateSeedQuantiy = (landSize: number): number => {
  if (landSize > BASE_LAND_ACRE_SIZE) {
    return BASE_LAND_ACRE_SIZE * landSize;
  }

  return BASE_LAND_ACRE_SIZE / landSize;
};
