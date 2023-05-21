import { Locations } from "./Locations";

export interface ILocationsResponse {
    result: Array<ILocationResponseItem>
};

export interface ILocationResponseItem  {
  id: string;
  title: string;
  data: Array<any>;
  totalCount?: number;
}
