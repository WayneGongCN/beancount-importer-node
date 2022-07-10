import { writeFile } from "fs";
import { Conf } from "../bin/bean-importer";


export interface BeancountRecord {
  date: Date;
  symbol: string; // '*' | '!';
  payee: string;  // 收款人
  comments: string; // 备注
  records: AccountRecord[]
}

export interface AccountRecord {
  account: string;  // 账户
  amount: number; // 金额
  currency: string; // 货币
}



const stringifyDate = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`


const genAccountRecord = (data: AccountRecord) => {
  const { account, amount, currency } = data
  return `  ${account} ${amount} ${currency}`
}


const genBeancountRecord = (data: BeancountRecord) => {
  const { date, symbol, payee, comments, records } = data
  const recordStr = records.map(genAccountRecord).join('\n')
  return `
${stringifyDate(date)} ${symbol || '*'} "${payee || ''}" "${comments || ''}"
${recordStr}
`
}


export default (conf: Conf) => (records: BeancountRecord[]): Promise<void> => {
  const { outputPath: filePath } = conf;
  const content = records.map(genBeancountRecord).join('\n')

  return new Promise((resolve, reject) => {
    writeFile(filePath, content, (err => {
      if (err) reject(err)
      resolve()
    }))
  })
}