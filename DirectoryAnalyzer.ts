import * as fs from 'fs';
import * as path from 'path';
import { DirectoryReport } from './DirectoryReport';

export class DirectoryAnalyzer {
  analyze(dirPath: string): DirectoryReport {
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory does not exist: ${dirPath}`);
    }

    let files = 0;
    let directories = 0;
    let totalSize = 0;
    const extensions: Record<string, number> = {};

    const traverse = (currentPath: string) => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          directories++;
          traverse(fullPath);
        } else if (entry.isFile()) {
          files++;
          const ext = path.extname(entry.name);
          extensions[ext] = (extensions[ext] || 0) + 1;
          totalSize += fs.statSync(fullPath).size;
        }
      }
    };

    traverse(dirPath);

    return { files, directories, totalSize, extensions };
  }
}
