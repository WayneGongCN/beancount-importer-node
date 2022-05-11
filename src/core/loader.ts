import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { Conf } from '../bin/bean-importer';


const readFile = (filePath: string) => {
  return readFileSync(filePath, { encoding: 'utf8' })
}


const csvLoader = (content: string) => {
  return parse(content, {
    trim: true,
    columns: true,
    skip_empty_lines: true,
    skip_records_with_error: true,
    from_line: 7
  });
}

const loadMap = {
  csv: csvLoader
}


export default (conf: Conf, ctx: any): any => {
  const str = readFile(conf.inputPath)

  const loader = loadMap[conf.loader];
  const data = loader(str)
  return data
}