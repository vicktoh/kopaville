import { APP_ENV } from "./config";

export const LOCAL_SYSTEM_INFO = 'local_system_info';
export const ONBORDING_INFO = 'onbording_info';
export const LOCAL_USER_INFO = 'local_user_info';
export const PAYSTACK_LIVE_SK_KEY = 'sk_live_5eee3ba11671095257410864ca62e2ca5ac3d22f';
export const PAYSTACK_LIVE_PK_KEY = 'pk_live_3ad0ca6cd34e46721f29bde8746be4a1bb1754af'
export const PAY_STACK_SK_KEY = APP_ENV === 'dev' ? 'sk_test_f0d239ff4c6dfc6231ed70ef5577905afeee38dd' : PAYSTACK_LIVE_SK_KEY;
export const PAY_STACK_PK_KEY = APP_ENV === 'dev' ? 'pk_test_84be447cfd8e04c193a48dc7d2d3f0f8810d331d' : PAYSTACK_LIVE_PK_KEY;

export const PRIVACY_POLICY_LINK = 'https://kopaville.com/about-2/';
export const TERMS_CONDITION_LINK = 'https://kopaville.com/menu/';
export const SUPPORT_EMAIL = 'kopaville@gmail.com'
export const DEV_ALGOLIA_ID = "9T1KSWZ1DK";
export const PROD_ALGOLIA_ID = "A8F5S4VTVX"
export const ALGOLIA_APP_ID =  APP_ENV === "dev" ? DEV_ALGOLIA_ID : PROD_ALGOLIA_ID;
export const DEV_ALGOLIA_SERACH_KEY ="860741bf2d0cf5100fbee3cfb0fbee96";
export const PROD_ALGOLIA_SEARCH_KEY = "7fd2cf53e290951d203636665bb3b179";
export const ALGOLIA_API_SEARCH_KEY = APP_ENV === "dev" ? DEV_ALGOLIA_SERACH_KEY: PROD_ALGOLIA_SEARCH_KEY;

