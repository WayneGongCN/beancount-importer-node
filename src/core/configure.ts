import { Conf, MapperKey, ParseRule } from "../bin/bean-importer";



export default (conf: Conf): Conf => {
  const DEFAULT_CONF: Partial<Conf> = {
    symbol: '*'
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
    },
    {
      key: MapperKey.records,
      fn: (val: any, conf: Conf) => {
        return [
          {
            amount: val.amount,
            account: val.account,
            amountDebit: val.amountDebit,
            currency: conf.currency
          }
        ]
      }
    },
  ]


  return {
    ...DEFAULT_CONF,
    ...conf,
    parseRules: [...DEFAULT_PARSER_RULES, ...conf.parseRules],
  }
}