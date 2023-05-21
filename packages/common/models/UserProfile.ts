export class UserProfile {
    'created_at'?: string;
    'user_id'?: string;
    'email'?: string;
    'email_verified'?: boolean;
    'family_name'?: string;
    'updated_at'?: string;
    'identities'?: any;
    'appMetadata'?: any;
    'user_metadata'?: UserMetadata;
    'picture'?: string;
    'name'?: string;
    'nickname'?: string;
    'given_name'?: string;
    'last_ip'?: string;
    'last_login'?: string;
    'logins_count'?: number;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "created_at",
            "baseName": "created_at",
            "type": "string",
            "format": ""
        },
        {
            "name": "user_id",
            "baseName": "user_id",
            "type": "string",
            "format": ""
        },
        {
            "name": "email",
            "baseName": "email",
            "type": "string",
            "format": ""
        },
        {
            "name": "email_verified",
            "baseName": "email_verified",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "createdAt",
            "baseName": "created_at",
            "type": "string",
            "format": ""
        },
        {
            "name": "updated_at",
            "baseName": "updated_at",
            "type": "string",
            "format": ""
        },
        {
            "name": "identities",
            "baseName": "identities",
            "type": "any",
            "format": ""
        },
        {
            "name": "appMetadata",
            "baseName": "app_metadata",
            "type": "any",
            "format": ""
        },
        {
            "name": "user_metadata",
            "baseName": "user_metadata",
            "type": "any",
            "format": ""
        },
        {
            "name": "picture",
            "baseName": "picture",
            "type": "string",
            "format": ""
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "nickname",
            "baseName": "nickname",
            "type": "string",
            "format": ""
        },
        {
            "name": "given_name",
            "baseName": "given_name",
            "type": "string",
            "format": ""
        },
        {
            "name": "family_name",
            "baseName": "family_name",
            "type": "string",
            "format": ""
        },
        {
            "name": "last_ip",
            "baseName": "last_ip",
            "type": "string",
            "format": ""
        },
        {
            "name": "last_login",
            "baseName": "last_login",
            "type": "string",
            "format": ""
        },
        {
            "name": "logins_count",
            "baseName": "logins_count",
            "type": "number",
            "format": ""
        }
    ];

    static getAttributeTypeMap() {
        return UserProfile.attributeTypeMap;
    }
    
    public constructor() {
    }
}

export class UserMetadata {
    'roles'?: Array<string>;
    'phone_number'?: string;
    'primary_zip'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "roles",
            "baseName": "roles",
            "type": "array",
            "format": ""
        },
        {
            "name": "phone_number",
            "baseName": "phone_number",
            "type": "string",
            "format": ""
        },
        {
            "name": "primary_zip",
            "baseName": "primary_zip",
            "type": "string",
            "format": ""
        }
    ];

    static getAttributeTypeMap() {
        return UserMetadata.attributeTypeMap;
    }
    
    public constructor() {
    }
}