import { Conf, MapperKey, ParseRule } from "../bin/bean-importer";



export default (conf: Conf, cliOptions: Partial<Conf>): Conf => {
  const DEFAULT_CONF: Partial<Conf> = {
    // symbol: '*'
  }

  const DEFAULT_PARSER_RULES: ParseRule[] = [
    {
      key: MapperKey.date,
      fn: (val: any, conf: Conf) => {
        const dateStr = val[MapperKey.date]?.trim();
        const date = new Date(dateStr)
        if (date.getTime()) return date
        else return dateStr
      }
    }
  ]


  return {
    ...DEFAULT_CONF,
    ...conf,
    ...cliOptions,
    fieldParseRules: [...DEFAULT_PARSER_RULES, ...conf.fieldParseRules],
  }
}