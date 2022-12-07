export const DEBUG = `${process.env.REACT_APP_DEBUG}` === "1";
export const ENCRYPTION_KEY = `${process.env.REACT_APP_STATE_ENCRYPTION_KEY}`;
export const FRESHNESS_DELAY_IN_SECS = 300; // 5 min

export const DATE_FORMAT_DATA = "YYYY-MM-DD";
export const DATE_FORMAT_SHORT = "DD/MM/YYYY";

export const LIST_PAGE_SIZE = 30;
export const LIST_ITEM_MIN_WIDTH = "340px";
export const LIST_ITEM_MIN_WIDTH_SM = "120px";

export const MINI_DRAWER_WIDTH = "56px";
export const DRAWER_WIDTH = "240px";

const PUBLIC_URL = `${process.env.PUBLIC_URL}`;
export const URL_ROOT = PUBLIC_URL === "." ? "" : PUBLIC_URL;
