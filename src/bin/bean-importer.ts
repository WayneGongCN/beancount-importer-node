#!/usr/bin/env node
import { Command } from "commander";
import { join } from "path";
import loader from "../core/loader";
import parser from "../core/parser";
import configure from "../core/configure";
import generator, { BeancountRecord } from "../core/generator";


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
  amountCredit = 'amountCredit',
  amountDebit = 'amountDebit',
  records = 'records',
}

export interface Conf {
  inputPath: string;
  outputPath: string;
  loader: 'csv',
  symbol?: '*' | '!';
  mapperConf: Partial<Record<MapperKey, string>>,
  parseRules: ParseRule[]
}

export const conf: Conf = {
  inputPath: join(process.cwd(), 'CMB.csv'),
  outputPath: join(__dirname, 'output.bean'),
  loader: 'csv',

  mapperConf: {
    [MapperKey.date]: "交易日期",
    [MapperKey.comments]: "交易备注",
    [MapperKey.amountCredit]: "收入",
    [MapperKey.amountDebit]: "支出",
    [MapperKey.payee]: "交易类型"
  },

  parseRules: [
    // {
    //   key: MapperKey.comments,
    //   fn: (val: any) => val.comments?.trim()
    // },
    // {
    //   key: MapperKey.payee,
    //   fn: (val: any) => val.comments?.trim()
    // },
    {
      key: MapperKey.date,
      fn: (val: any) => new Date(val.date.replace(/([\d]{4})([\d]{2})([\d]{2})/, "$1-$2-$3"))
    },
    {
      key: MapperKey.records,
      fn: (val: any, conf: Conf) => {
        // 借记就是把账户上的资金移除，贷记就是增加账户的资金
        // amountCredit: string; // 贷记金额，正数（消费支出）
        // amountDebit: string;  // 借记金额，负数（信用卡）

        const { amountCredit, amountDebit } = val;
        const creditRecords = []
        const debitRecords = []

        if (amountDebit) {
          creditRecords.push({
            currency: 'CNY',
            account: 'CMB617',
            amount: -Number(amountDebit)
          })
          debitRecords.push({
            currency: 'CNY',
            account: 'xxxx',
            amount: Number(amountDebit),
          })
        }
        
        else if (amountCredit) {
          creditRecords.push({
            currency: 'CNY',
            account: 'xxxx',
            amount: -Number(amountCredit)
          })
          debitRecords.push({
            currency: 'CNY',
            account: 'CMB617',
            amount: Number(amountCredit),
          })
        }

        const records = [
          ...creditRecords,
          ...debitRecords
        ]

        return records
      }
    },
  ]
}


const mergedConf = configure(conf)
const data = loader(mergedConf, {})
const standData = parser(mergedConf, {})(data)
const output =  generator(mergedConf, {})(standData).then(() => {
console.log(standData, output)
})