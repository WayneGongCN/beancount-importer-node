import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { Conf } from '../bin/bean-importer';


const readFile = (filePath: string) => {
  return readFileSync(filePath, {encoding: 'utf8'})
}


const csvLoader = (str: string) => {
  return parse(str, {
    trim: true,
    columns: true,
    skip_empty_lines: true,
    skip_records_with_error: true,
    from_line: 7
  });
}


export default (conf: Conf, ctx: any): any => {
  const str = readFile(conf.inputPath)
  const data = csvLoader(str)
  return data
}