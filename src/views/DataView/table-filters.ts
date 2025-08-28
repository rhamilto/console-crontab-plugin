import * as _ from "lodash-es";
import * as fuzzy from "fuzzysearch";

export const fuzzyCaseInsensitive = (a: string, b: string): boolean =>
  fuzzy(_.toLower(a), _.toLower(b));

export const exactMatch = (a: string, b: string): boolean =>
  !a || b?.includes(a);
