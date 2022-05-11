#!/usr/bin/env node
import { Command } from "commander";
import { join } from "path";
import loader from "../core/loader";
import parser from "../core/parser";
import configure from "../core/configure";
import { BeancountRecord } from "../core/generator";


/**
 * 
 */
function handler() {
}


/**
 * 
 */
const packageJson = require("../../package.json");
new Command()
  .name("bean-importer")
  .version(packageJson.version, "-v --version", "Output bean-importer version")
  .action(handler)
  .parse(process.argv);




export interface ParseRule {
  key: keyof BeancountRecord
  fn?: (val: string, conf: Conf) => any;
  reg?: RegExp;
  result?: string
}

export enum MapperKey {
  date = 'date',
  payee = 'payee',
  comments = 'comments',
  amount = 'amount',
  amountDebit = 'amountDebit',
  records = 'records',
}

export interface Conf {
  inputPath: string;
  outputPath: string;
  currency: string;
  symbol?: '*' | '!';
  mapperConf: Partial<Record<MapperKey, string>>,
  parseRules: ParseRule[]
}


export const conf: Conf = {
  inputPath: join(process.cwd(), 'CMB.csv'),
  outputPath: join(__dirname, 'output.bean'),

  currency: 'CNY',
  mapperConf: {
    [MapperKey.date]: "交易日期",
    [MapperKey.comments]: "交易备注",
    [MapperKey.amount]: "支出",
    [MapperKey.amountDebit]: "收入",
  },

  parseRules: [
    {
      key: MapperKey.comments,
      fn: (val: any) => val.comments?.trim()
    },
    {
      key: MapperKey.payee,
      fn: (val: any) => val.comments?.trim()
    },
    {
      key: MapperKey.date,
      fn: (val: any) => new Date(val.date.replace(/([\d]{4})([\d]{2})([\d]{2})/, "$1-$2-$3"))
    },
  ]
}

const mergedConf = configure(conf)
const data = loader(mergedConf, {})
const standData = parser(mergedConf, {})(data)
console.log(standData)