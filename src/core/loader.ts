import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { Conf } from '../bin/bean-importer';


const readFile = (filePath: string) => readFileSync(filePath, { encoding: 'utf8' })


const csvLoader = (filePath: string) => {
  const content = readFile(filePath)
  return parse(content, {
    trim: true,
    columns: true,
    skip_empty_lines: true,
    skip_records_with_error: true,
    from_line: 7
  });
}

const jsonLoader = (filePath: string) => {
  return require(filePath)
}

const loadMap = {
  csv: csvLoader,
  json: jsonLoader
}


export default (conf: Conf): any => () => loadMap[conf.loader]?.(conf.inputPath)