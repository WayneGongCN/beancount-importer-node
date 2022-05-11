import { Conf, ParseRule } from "../bin/bean-importer";
import { BeancountRecord } from "./generator";


const mapper = (mapperConf: Conf['mapperConf']) => {
  const mapKeys = Object.keys(mapperConf)

  return (data: any) => mapKeys.reduce((o, key) => {
    // @ts-ignore
    o[key] = data[mapperConf[key]];
    return o
  }, {} as any)
}


const parser = (conf: Conf) => (parseRules: ParseRule[]) => {
  return (data: any) => parseRules.reduce<BeancountRecord>((o, rule) => {
    const { key, fn } = rule
    o[key] = fn(data, conf)
    return o
  }, data)
}

export default (conf: Conf, ctx: any) => (data: any[]) => {
  const { mapperConf, parseRules } = conf

  return data
    .map(mapper(mapperConf))
    .map(parser(conf)(parseRules))
}