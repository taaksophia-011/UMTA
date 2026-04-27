import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1j_IOqUATkTtY84g6HC792pQ4Z96TNy9yjz_RXDMXrIo/export?format=csv';

export const fetchSheetData = async () => {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        complete: (results) => {
          const rows = results.data;
          const workItems = [];
          const summary = [];
          let sheetDate = '';
          let currentId = 1;

          // 1. Extract Date (Cell B5 -> rows[4][1])
          if (rows[4] && rows[4][1]) {
            sheetDate = rows[4][1].trim();
          }

          // 2. Extract Summary Table (Rows 9-15 -> indices 9-15)
          for (let i = 9; i <= 15; i++) {
            if (rows[i] && rows[i][1]) {
              summary.push({
                name: rows[i][1].trim(),
                count: parseInt(rows[i][3]) || 0
              });
            }
          }

          // 3. Helper to parse blocks
          const parseBlock = (startRow, startCol, agencyName) => {
            let rowIdx = startRow + 2;
            while (rowIdx < rows.length && rows[rowIdx] && rows[rowIdx][startCol]) {
              const srNo = rows[rowIdx][startCol];
              if (isNaN(parseInt(srNo))) break;
              
              const work = rows[rowIdx][startCol + 1]?.trim();
              const completion_date = rows[rowIdx][startCol + 2] || '';
              const status = rows[rowIdx][startCol + 3] || 'Pending';

              if (work) {
                workItems.push({
                  id: currentId++,
                  agency: agencyName,
                  work: work.replace(/\s+/g, ' '),
                  completion_date: completion_date || '2026-12-31',
                  status: status || 'Pending'
                });
              }
              rowIdx++;
            }
          };

          // Find start of blocks
          for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
              const cell = rows[i][j]?.trim();
              if (cell === 'NHAI') parseBlock(i, j, 'NHAI');
              if (cell === 'Municipal Corporation Ludhiana (MCL)') parseBlock(i, j, 'MCL');
              if (cell === 'Greater Ludhiana Area Development Authority (GLADA)') parseBlock(i, j, 'GLADA');
              if (cell === 'Railways') parseBlock(i, j, 'Railways');
              if (cell === 'Public Works Department (PWD)') parseBlock(i, j, 'PWD');
              if (cell === 'PSIEC') parseBlock(i, j, 'PSIEC');
              if (cell === 'Roadways') parseBlock(i, j, 'Roadways');
            }
          }

          resolve({
            date: sheetDate,
            summary: summary.sort((a, b) => b.count - a.count),
            workItems: workItems
          });
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};
