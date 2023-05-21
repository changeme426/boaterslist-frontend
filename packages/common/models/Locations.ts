/**
 * boaterslist-backend
 * REST api for boater&#39;s list suite of applications
 *
 * OpenAPI spec version: 1.1.0
 * Contact: george@thearchitects.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Companies } from './Companies';
import { SubCategories } from './SubCategories';

/**
* (tsType: Locations, schemaOptions: { includeRelations: true })
*/
export class Locations {
  'active': boolean
  'locationId': number;
  'locationName'?: string;
  'phoneNumber'?: string;
  'description'?: string;
  'address1'?: string;
  'address2'?: string;
  'city'?: string;
  'dist'?: number;
  'state'?: string;
  'zipCode'?: string;
  'country'?: string;
  'operatingDaysHoursJSON'?: string | Array<any>;
  'contactPerson'?: string;
  'contactEmail'?: string;
  'claimVerified2'?: boolean;
  'claimedFromId2'?: string;
  'claimedBy2'?: string;
  'claimedOn2'?: string;
  'interestedIn2'?: string;
  'howYouHearAboutUs2'?: string;
  'contactPhone'?: string;
  'bestFormOfCommunication'?: string;
  'website'?: any;
  'verifiedByUserId'?: number;
  'verified'?: number;
  'createdByUserId'?: number;
  'dateCreated': Date;
  'priceRangeLow'?: number;
  'priceRangeHigh'?: number;
  'promotedKeywords'?: string[]
  'promotedSubCategories'?: number[]
  'peopleServiceMaxCount'?: number;
  'electricShorePower'?: string;
  'boatSize'?: string;
  'fuel'?: string;
  'isPrivate'?: number;
  'membershipNeeded'?: number;
  'sponsoredBy'?: string;
  'listed'?: number;
  'premiere'?: number;
  'gold'?: number;
  'platinum'?: number;
  'slips'?: string;
  'priceRangeString'?: string;
  'privacyMembershipString'?: string;
  'coordinate'?: any;
  'companyId': number;
  'company'?: Companies;
  'subCategories'?: number[]

  static readonly discriminator: string | undefined = undefined;

  static readonly attributeTypeMap: Array<{ name: string, baseName: string, type: string, format: string }> = [
    {
      "name": "active",
      "baseName": "active",
      "type": "boolean",
      "format": ""
    },
    {
      "name": "locationId",
      "baseName": "locationId",
      "type": "number",
      "format": ""
    },
    {
      "name": "locationName",
      "baseName": "locationName",
      "type": "string",
      "format": ""
    },
    {
      "name": "phoneNumber",
      "baseName": "phoneNumber",
      "type": "string",
      "format": ""
    },
    {
      "name": "claimVerified2",
      "baseName": "claimVerified2",
      "type": "boolean",
      "format": ""
    },
    {
      "name": "claimedBy2",
      "baseName": "claimedBy2",
      "type": "string",
      "format": ""
    },
    {
      "name": "claimedOn2",
      "baseName": "claimedOn2",
      "type": "string",
      "format": ""
    },
    {
      "name": "claimedFromId2",
      "baseName": "claimedFromId2",
      "type": "string",
      "format": ""
    },
    {
      "name": "interestedIn2",
      "baseName": "interestedIn2",
      "type": "string",
      "format": ""
    },
    {
      "name": "howYouHearAboutUs2",
      "baseName": "howYouHearAboutUs2",
      "type": "string",
      "format": ""
    },
    {
      "name": "description",
      "baseName": "description",
      "type": "string",
      "format": ""
    },
    {
      "name": "address1",
      "baseName": "address1",
      "type": "string",
      "format": ""
    },
    {
      "name": "address2",
      "baseName": "address2",
      "type": "string",
      "format": ""
    },
    {
      "name": "city",
      "baseName": "city",
      "type": "number",
      "format": ""
    },
    {
      "name": "dist",
      "baseName": "dist",
      "type": "string",
      "format": ""
    },
    {
      "name": "state",
      "baseName": "state",
      "type": "string",
      "format": ""
    },
    {
      "name": "zipCode",
      "baseName": "zipCode",
      "type": "string",
      "format": ""
    },
    {
      "name": "country",
      "baseName": "country",
      "type": "string",
      "format": ""
    },
    {
      "name": "operatingDaysHoursJSON",
      "baseName": "operatingDaysHoursJSON",
      "type": "Array<any>",
      "format": ""
    },
    {
      "name": "contactPerson",
      "baseName": "contactPerson",
      "type": "string",
      "format": ""
    },
    {
      "name": "contactEmail",
      "baseName": "contactEmail",
      "type": "string",
      "format": ""
    },
    {
      "name": "contactPhone",
      "baseName": "contactPhone",
      "type": "string",
      "format": ""
    },
    {
      "name": "bestFormOfCommunication",
      "baseName": "bestFormOfCommunication",
      "type": "string",
      "format": ""
    },
    {
      "name": "website",
      "baseName": "website",
      "type": "string",
      "format": ""
    },
    {
      "name": "verifiedByUserId",
      "baseName": "verifiedByUserId",
      "type": "number",
      "format": ""
    },
    {
      "name": "verified",
      "baseName": "verified",
      "type": "number",
      "format": ""
    },
    {
      "name": "createdByUserId",
      "baseName": "createdByUserId",
      "type": "number",
      "format": ""
    },
    {
      "name": "dateCreated",
      "baseName": "dateCreated",
      "type": "Date",
      "format": "date-time"
    },
    {
      "name": "priceRangeLow",
      "baseName": "priceRangeLow",
      "type": "number",
      "format": ""
    },
    {
      "name": "priceRangeHigh",
      "baseName": "priceRangeHigh",
      "type": "number",
      "format": ""
    },
    {
      "name": "peopleServiceMaxCount",
      "baseName": "peopleServiceMaxCount",
      "type": "number",
      "format": ""
    },
    {
      "name": "electricShorePower",
      "baseName": "electricShorePower",
      "type": "string",
      "format": ""
    },
    {
      "name": "boatSize",
      "baseName": "boatSize",
      "type": "string",
      "format": ""
    },
    {
      "name": "fuel",
      "baseName": "fuel",
      "type": "string",
      "format": ""
    },
    {
      "name": "isPrivate",
      "baseName": "isPrivate",
      "type": "number",
      "format": ""
    },
    {
      "name": "membershipNeeded",
      "baseName": "membershipNeeded",
      "type": "number",
      "format": ""
    },
    {
      "name": "sponsoredBy",
      "baseName": "sponsoredBy",
      "type": "string",
      "format": ""
    },
    {
      "name": "listed",
      "baseName": "listed",
      "type": "number",
      "format": ""
    },
    {
      "name": "premiere",
      "baseName": "premiere",
      "type": "number",
      "format": ""
    },
    {
      "name": "gold",
      "baseName": "gold",
      "type": "number",
      "format": ""
    },
    {
      "name": "platinum",
      "baseName": "platinum",
      "type": "number",
      "format": ""
    },
    {
      "name": "slips",
      "baseName": "slips",
      "type": "string",
      "format": ""
    },
    {
      "name": "priceRangeString",
      "baseName": "priceRangeString",
      "type": "string",
      "format": ""
    },
    {
      "name": "privacyMembershipString",
      "baseName": "privacyMembershipString",
      "type": "string",
      "format": ""
    },
    {
      "name": "coordinate",
      "baseName": "coordinate",
      "type": "any",
      "format": ""
    },
    {
      "name": "companyId",
      "baseName": "companyId",
      "type": "number",
      "format": ""
    },
    {
      "name": "company",
      "baseName": "company",
      "type": "CompaniesWithRelations",
      "format": ""
    },
    {
      "name": "subCategories",
      "baseName": "subCategories",
      "type": "Array<SubCategoriesWithRelations>",
      "format": ""
    }];

  static getAttributeTypeMap() {
    return Locations.attributeTypeMap;
  }

  public constructor() {
  }
}
