export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;
export const VALID_SORT_FIELDS = new Set(["name", "created_at", "delivery_fee", "minimum_order"]);

export enum RestaurantStatus {
	Pending = "pending",
	Approved = "approved",
	Rejected = "rejected",
	Suspended = "suspended",
	Inactive = "inactive",
}

export enum SortOrder {
	ASC = "ASC",
	DESC = "DESC",
}