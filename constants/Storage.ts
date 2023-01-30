import { APP_ENV } from "./config";

export const LOCAL_SYSTEM_INFO = 'local_system_info';
export const ONBORDING_INFO = 'onbording_info';
export const LOCAL_USER_INFO = 'local_user_info';

export const PAY_STACK_SK_KEY = 'sk_test_f0d239ff4c6dfc6231ed70ef5577905afeee38dd';
export const PAY_STACK_PK_KEY = 'pk_test_84be447cfd8e04c193a48dc7d2d3f0f8810d331d';

export const PRIVACY_POLICY_LINK = 'https://kopaville.com/static/privacy';
export const TERMS_CONDITION_LINK = 'https://kopaville.com/static/terms';
export const SUPPORT_EMAIL = ''
export const DEV_ALGOLIA_ID = "K4IFG2B4PM";
export const PROD_ALGOLIA_ID = "A8F5S4VTVX"
export const ALGOLIA_APP_ID =  APP_ENV === "dev" ? DEV_ALGOLIA_ID : PROD_ALGOLIA_ID;
export const DEV_ALGOLIA_SERACH_KEY ="860741bf2d0cf5100fbee3cfb0fbee96";
export const PROD_ALGOLIA_SEARCH_KEY = "7fd2cf53e290951d203636665bb3b179";
export const ALGOLIA_API_SEARCH_KEY = APP_ENV === "dev" ? DEV_ALGOLIA_SERACH_KEY: PROD_ALGOLIA_SEARCH_KEY;

