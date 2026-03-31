export interface Community {
  id: string;
  name: string;
  communityKey: string; // exact COMMUNITY value in Snowflake D_MERCHANT_COMMUNITY_MAP
}

export interface Brand {
  id: string;
  name: string;
  categoryId: string;
  merchantKey: string; // exact MERCHANT value in Snowflake D_MERCHANT_COMMUNITY_MAP
}

export interface Category {
  id: string;
  name: string;
}

export interface Merchant {
  id: string;
  name: string;
  parentMerchant: string;
  communityId: string;
}

export interface AudienceRow {
  communityId: string;
  communityName: string;
  percentFans: number;
  purchasesPerFanIndex: number;
  compositeIndex: number;
}

export interface MerchantRow {
  merchantId: string;
  merchantName: string;
  parentMerchant: string;
  percentFans: number;
  purchasesPerFanIndex: number;
  compositeIndex: number;
}

export interface AudienceQueryParams {
  merchantKey?: string; // maps to MERCHANT column in Snowflake
  categoryName?: string; // maps to CATEGORY column in Snowflake
  states?: string[]; // maps to STATE column in F_SUMMARY_FS_GEO_STATE
}

export interface MerchantQueryParams extends AudienceQueryParams {
  communityId: string;
}
