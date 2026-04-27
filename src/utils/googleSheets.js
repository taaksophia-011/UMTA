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
          const formattedData = [];
          let currentId = 1;

          // Helper to parse blocks
          // Looking at the CSV structure, agencies are in specific rows
          // NHAI is around row 17 (0-indexed)
          // Rows have two blocks side-by-side: NHAI and MCL, then GLADA and Railways, etc.
          
          const parseBlock = (startRow, startCol, agencyName) => {
            let rowIdx = startRow + 2; // Skip Agency Name and Headers (Sr no, Work, ...)
            while (rowIdx < rows.length && rows[rowIdx] && rows[rowIdx][startCol]) {
              const srNo = rows[rowIdx][startCol];
              if (isNaN(parseInt(srNo))) break; // End of block if Sr No is not a number
              
              const work = rows[rowIdx][startCol + 1]?.trim();
              const completion_date = rows[rowIdx][startCol + 2] || '';
              const status = rows[rowIdx][startCol + 3] || 'Pending';

              if (work) {
                formattedData.push({
                  id: currentId++,
                  agency: agencyName,
                  work: work.replace(/\s+/g, ' '), // Clean up whitespace/newlines
                  completion_date: completion_date || '2026-12-31', // Fallback date if missing
                  status: status || 'Pending'
                });
              }
              rowIdx++;
            }
          };

          // Find start of blocks by searching for agency names in the sheet
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

          resolve(formattedData);
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
