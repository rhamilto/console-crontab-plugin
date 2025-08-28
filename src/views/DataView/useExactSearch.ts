import { useUserSettings } from "@openshift-console/dynamic-plugin-sdk";

const PREFERRED_EXACT_SEARCH_USER_SETTING_KEY = "console.enableExactSearch";

export const useExactSearch = (): [boolean, boolean] => {
  const [exactSearch, , exactSearchLoaded] = useUserSettings<boolean>(
    PREFERRED_EXACT_SEARCH_USER_SETTING_KEY
  );
  return [exactSearch, exactSearchLoaded];
};
