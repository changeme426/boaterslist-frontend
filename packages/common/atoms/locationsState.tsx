import {atom, selector} from "recoil";
import { Locations } from "../models/Locations";
import { ILocationsResponse } from "../models/ILocationsResponse";

export const locationsState = atom<any>({
    key: 'locationsState',
    default: [{ id: "", title:"", data:[], totalCount: 0 }]
});

export const locationsCoordinates = selector({
    key: 'locationsCoordinates',
    get: ({get}) =>  {
        const locations = get(locationsState) as any;
        if(locations && locations.length > 0 && locations[0].data){
          return locations[0].data.filter((location: any) => location.source.coordinate && location.source.coordinate.lat && location.source.coordinate.lon)
        }
        return;
    }

});
