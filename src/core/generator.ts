import { writeFile } from "fs";
import { Conf } from "../bin/bean-importer";


export interface BeancountRecord {
  date: Date;
  symbol: string; // '*' | '!';
  payee: string;
  comments: string;
  records: AccountRecord[]
}

export interface AccountRecord {
  account: string;
  amount: string;
  amountDebit: string;
  currency: string;
}




const stringifyDate = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}${date.getDate()}`


const genAccountRecord = (data: AccountRecord) => {
  const { account, amount, currency } = data
  return `${account} ${amount} ${currency}`
}


const genBeancountRecord = (data: BeancountRecord) => {
  const { date, symbol, payee, comments, records } = data
  const recordStr = records.map(genAccountRecord).join('\n')
  return `
${stringifyDate(date)} ${symbol} ${comments}
${recordStr}
`
}


export default (conf: Conf, ctx: any) => (records: BeancountRecord[]): Promise<void> => {
  const { outputPath: filePath } = conf;
  const content = records.map(genBeancountRecord).join('\n')

  return new Promise((resolve, reject) => {
    writeFile(filePath, content, (err => {
      if (err) reject(err)
      resolve()
    }))
  })
}