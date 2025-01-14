// export-cms.js
const fs = require('fs').promises;

const extractorHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>CMS Data Extractor</title>
</head>
<body>
    <h2>Export CMS Data</h2>
    <button onclick="exportData()">Export Data</button>

    <script>
        function exportData() {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }
            
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/json;charset=utf-8,' + 
                encodeURIComponent(JSON.stringify(data, null, 2)));
            element.setAttribute('download', 'cms-data.json');
            element.click();
        }
    </script>
</body>
</html>
`;

fs.writeFile('cms-extractor.html', extractorHtml)
    .then(() => console.log('Created cms-extractor.html - open this in your browser'));