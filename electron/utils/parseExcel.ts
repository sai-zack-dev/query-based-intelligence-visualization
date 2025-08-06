import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

/**
 * Parse Excel files and extract sheets and headers.
 * @param filePaths Array of full file paths.
 */
export function parseExcelFiles(filePaths: string[]) {
  const result: Record<string, Record<string, string[]>> = {};

  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) continue;

    const workbook = XLSX.readFile(filePath);
    const fileName = path.basename(filePath);
  console.log("w: " + workbook.SheetNames, "f: " + fileName)

    result[fileName] = {};

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
      const headers = (json[0] || []).map((cell) => String(cell));
      result[fileName][sheetName] = headers;
    }
  }

  return result;
}
