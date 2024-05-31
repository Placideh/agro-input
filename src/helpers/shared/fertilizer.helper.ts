import { BASE_FERTILIZER_PER_BASE_LAND_ACRE_SIZE } from "../../constants/general";

export const calculateFertilizerQuantiy = (landSize: number): number => {
  return BASE_FERTILIZER_PER_BASE_LAND_ACRE_SIZE * landSize;
};
