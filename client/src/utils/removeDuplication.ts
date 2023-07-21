import { IJob } from "../interfaces/Job";

export const removeDuplicateData = (array: Array<[]>) => {
  return array
    .slice()
    .reverse()
    .reduce((unique: any, o: any) => {
      if (!unique.some((obj: IJob) => obj.id === o.id)) {
        unique.push(o);
      }
      return unique;
    }, [])
    .reverse();
};
