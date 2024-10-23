document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const resultDiv = document.querySelector('.result');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const urlInput = form.querySelector('input[name="url"]');
        const url = urlInput.value.trim();
        
        // Basic URL validation
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlPattern.test(url)) {
            resultDiv.innerHTML = '<p class="error">Please enter a valid URL.</p>';
            return;
        }
        
        resultDiv.innerHTML = '<p>Checking URL...</p>';
        
        try {
            const response = await fetch('/check-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });
            
            const result = await response.json();
            
            if (result.error) {
                resultDiv.innerHTML = `<p class="error">${result.error}</p>`;
            } else {
                displayResults(result.data);
            }
        } catch (error) {
            resultDiv.innerHTML = '<p class="error">Error checking URL. Please try again.</p>';
        }
    });
    
    function displayResults(data) {
        let html = `
            <h2>Result for: ${data.resource}</h2>
            <h3>URL Analysis Report</h3>
            <table class="analysis-table">
                <tr>
                    <th>Detail</th>
                    <th>Information</th>
                </tr>
                <tr>
                    <td>Last Analysis Date</td>
                    <td>${data.last_analysis_date || 'N/A'}</td>
                </tr>
                <tr>
                    <td>Malicious Count</td>
                    <td>${data.positives || 0} / ${data.total || 0}</td>
                </tr>
                <tr>
                    <td>Permalink</td>
                    <td><a href="${data.permalink}" target="_blank">View Report</a></td>
                </tr>
            </table>
            
            <h3>Scan Results:</h3>
        `;
        
        if (data.scans && Object.keys(data.scans).length > 0) {
            html += `
                <table class="scan-results-table">
                    <tr>
                        <th>Scanner</th>
                        <th>Result</th>
                    </tr>
            `;
            
            for (const [scanner, result] of Object.entries(data.scans)) {
                html += `
                    <tr class="${result.detected ? 'detected' : 'clean'}">
                        <td>${scanner}</td>
                        <td>${result.result || 'Clean'}</td>
                    </tr>
                `;
            }
            
            html += '</table>';
        } else {
            html += '<p>No scan results available.</p>';
        }
        
        resultDiv.innerHTML = html;
    }
});