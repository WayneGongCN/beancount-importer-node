#!/usr/bin/env node
import { Command } from "commander";
import { join, resolve } from "path";
import loader from "../core/loader";
import parser from "../core/parser";
import configure from "../core/configure";
import generator, { BeancountRecord } from "../core/generator";


/**
 * 
 */
export interface ParseRule {
  key: keyof BeancountRecord
  fn?: (val: string, conf: Conf) => any;
  reg?: RegExp;
  result?: string
}


/**
 * 
 */
export enum MapperKey {
  date = 'date',
  payee = 'payee',
  comments = 'comments',
  amount = 'amount',
  amountDebit = 'amountDebit',
  records = 'records',
}


/**
 * 
 */
export interface Conf {
  inputPath: string;
  outputPath: string;
  loader: 'csv' | 'json',
  mapperConf: Partial<Record<MapperKey, string>>,
  preParse: (data: any) => any,
  fieldParseRules: ParseRule[]
}


/**
 * 
 */
function handler(options: { conf: string, input: string, output: string }) {
  let { conf: confPath, input: inputPath, output: outputPath } = options;
  confPath = resolve(confPath)
  inputPath = resolve(inputPath)
  console.log(options)
  console.log({ confPath, inputPath })

  const mergedConf = configure(require(confPath), { inputPath, outputPath })
  const data = loader(mergedConf)()
  const standData = parser(mergedConf)(data)
  generator(mergedConf)(standData).then(() => {
    console.log('Done')
  })
}


/**
 * 
 */
const packageJson = require("../../package.json");
new Command()
  .name("bean-importer")
  .version(packageJson.version, "-v --version", "Output bean-importer version")
  .requiredOption('-c --conf <path>')
  .requiredOption('-i --input <path>')
  .requiredOption('-o --output <path>')
  .action(handler)
  .parse(process.argv)
