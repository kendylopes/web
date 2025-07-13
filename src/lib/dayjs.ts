import lib from "dayjs";
import "dayjs/locale/pt-br";
import realtiveTime from "dayjs/plugin/relativeTime";

lib.locale("pt-br");
lib.extend(realtiveTime);

export const dayjs = lib;
