/**
 * Print helper function to print table data
 * @param {Array} data - Array of data objects to print
 * @param {Function} formatDate - Function to format dates
 * @param {string} title - Title for the printed document
 * @param {Array} columns - Array of column configuration objects with {key, label}
 */
export const printTable = (data, formatDate, title = 'Table Data', columns = []) => {
  // Create a new window with only the table
  const printWindow = window.open('', '_blank')
  
  // Generate table rows
  const tableRows = data.map((item, index) => {
    const cells = columns.map(col => {
      let value;
      
      if (col.key === 'serialNumber') {
        value = index + 1;
      } else {
        value = item[col.key];
        
        // Format date if the column is a date field
        if (col.type === 'date' && formatDate && value) {
          value = formatDate(value);
        }
      }
      
      return `<td>${value || ''}</td>`;
    }).join('');
    
    return `<tr>${cells}</tr>`;
  }).join('');

  // Generate table headers
  const tableHeaders = columns.map(col => `<th>${col.label}</th>`).join('')

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @media print {
            @page {
              margin: 1cm;
            }
          }
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #4A5BD9;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              ${tableHeaders}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `

  printWindow.document.write(printContent)
  printWindow.document.close()
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      // Optionally close the window after printing
      // printWindow.close()
    }, 250)
  }
}
