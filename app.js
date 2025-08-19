// Variables globales
let currentData = null;
let currentFormat = null;
let convertedData = null;
let convertedFormat = null;

// Elementos del DOM
const themeToggle = document.getElementById('themeToggle');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const inputData = document.getElementById('inputData');
const detectedFormat = document.getElementById('detectedFormat');
const csvDelimiter = document.getElementById('csvDelimiter');
const processBtn = document.getElementById('processBtn');
const clearBtn = document.getElementById('clearBtn');
const treeViewBtn = document.getElementById('treeViewBtn');
const tableViewBtn = document.getElementById('tableViewBtn');
const copyViewBtn = document.getElementById('copyViewBtn');
const jsonTree = document.getElementById('jsonTree');
const treeView = document.getElementById('treeView');
const tableView = document.getElementById('tableView');
const dataTable = document.getElementById('dataTable');
const convertToCSV = document.getElementById('convertToCSV');
const convertToJSON = document.getElementById('convertToJSON');
const convertToXML = document.getElementById('convertToXML');
const convertToExcel = document.getElementById('convertToExcel');
const convertToSQL = document.getElementById('convertToSQL');
const csvOptions = document.getElementById('csvOptions');
const outputDelimiter = document.getElementById('outputDelimiter');
const copyResultBtn = document.getElementById('copyResultBtn');
const downloadBtn = document.getElementById('downloadBtn');
const conversionResult = document.getElementById('conversionResult');
const sqlModal = document.getElementById('sqlModal');
const tableName = document.getElementById('tableName');
const includeDropTable = document.getElementById('includeDropTable');
const includeCreateTable = document.getElementById('includeCreateTable');
const sqlPreview = document.getElementById('sqlPreview');
const generateSQLBtn = document.getElementById('generateSQLBtn');
const toastEl = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Datos de ejemplo
const sampleData = {
    csv: "",
    json: [
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

// Inicializar aplicación
function initializeApp() {
    // Mantener modo oscuro por defecto
    document.body.setAttribute('data-bs-theme', 'dark');
    themeToggle.checked = true;
    //Autoclic a limpiar
}

// Cargar datos de ejemplo
function loadSampleData() {
    inputData.value = sampleData.csv;
    currentFormat = 'csv';
    detectedFormat.value = 'CSV';
    processData();
}

// Configurar event listeners
function setupEventListeners() {
    // Toggle de tema
    themeToggle.addEventListener('change', toggleTheme);
    
    // Drag & Drop
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    // Carga de archivos
    fileInput.addEventListener('change', handleFileUpload);
    
    // Textarea input
    inputData.addEventListener('input', handleTextInput);
    
    // Botones principales
    processBtn.addEventListener('click', processData);
    clearBtn.addEventListener('click', clearAll);
    
    // Botones de vista
    treeViewBtn.addEventListener('click', () => switchView('tree'));
    tableViewBtn.addEventListener('click', () => switchView('table'));
    copyViewBtn.addEventListener('click', copyViewData);
    
    // Botones de conversión
    convertToCSV.addEventListener('click', () => convertData('csv'));
    convertToJSON.addEventListener('click', () => convertData('json'));
    convertToXML.addEventListener('click', () => convertData('xml'));
    convertToExcel.addEventListener('click', () => convertData('excel'));
    convertToSQL.addEventListener('click', showSQLModal);
    
    // Botones de resultado
    copyResultBtn.addEventListener('click', copyResultData);
    downloadBtn.addEventListener('click', downloadConvertedFile);
    
    // Modal SQL - CORREGIDO
    generateSQLBtn.addEventListener('click', generateAndDownloadSQL);
    tableName.addEventListener('input', updateSQLPreview);
    includeDropTable.addEventListener('change', updateSQLPreview);
    includeCreateTable.addEventListener('change', updateSQLPreview);
}

// Toggle tema día/noche
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-bs-theme', newTheme);
    
    // Actualizar texto del toggle
    const label = themeToggle.nextElementSibling;
    if (newTheme === 'dark') {
        label.innerHTML = '<i class="bi bi-moon-fill me-1"></i>Modo Noche';
    } else {
        label.innerHTML = '<i class="bi bi-sun-fill me-1"></i>Modo Día';
    }
}

// Manejar eventos de drag & drop
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        processFile(file);
    }
}

// Manejar carga de archivos
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

// Procesar archivo
function processFile(file) {
    const reader = new FileReader();
    
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                currentData = jsonData;
                currentFormat = 'excel';
                detectedFormat.value = 'EXCEL';
                
                displayData(currentData, currentFormat);
                enableConversionButtons();
                
                showToast('Archivo Excel cargado exitosamente');
            } catch (error) {
                showToast('Error al procesar archivo Excel: ' + error.message, 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        reader.onload = function(e) {
            const content = e.target.result;
            const format = detectFileFormat(file.name, content);
            
            inputData.value = content;
            currentFormat = format;
            detectedFormat.value = format.toUpperCase();
            
            showToast('Archivo cargado exitosamente');
        };
        reader.readAsText(file);
    }
}

// Manejar input de texto
function handleTextInput() {
    if (inputData.value.trim()) {
        const format = detectDataFormat(inputData.value);
        currentFormat = format;
        detectedFormat.value = format.toUpperCase();
    } else {
        currentFormat = null;
        detectedFormat.value = '';
    }
}

// Detectar formato de archivo
function detectFileFormat(fileName, content) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'json':
            return 'json';
        case 'csv':
            return 'csv';
        case 'xml':
            return 'xml';
        case 'xlsx':
        case 'xls':
            return 'excel';
        default:
            return detectDataFormat(content);
    }
}

// Detectar formato de datos
function detectDataFormat(data) {
    data = data.trim();
    
    // JSON
    if ((data.startsWith('{') && data.endsWith('}')) || 
        (data.startsWith('[') && data.endsWith(']'))) {
        try {
            JSON.parse(data);
            return 'json';
        } catch (e) {
            // No es JSON válido
        }
    }
    
    // XML
    if (data.startsWith('<') && data.endsWith('>')) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            if (xmlDoc.getElementsByTagName("parsererror").length === 0) {
                return 'xml';
            }
        } catch (e) {
            // No es XML válido
        }
    }
    
    // CSV
    const lines = data.split('\n');
    if (lines.length > 1) {
        const separators = [',', ';', '\t'];
        for (let sep of separators) {
            const firstLine = lines[0];
            const secondLine = lines[1];
            if (firstLine.includes(sep) && secondLine.includes(sep)) {
                const firstCount = firstLine.split(sep).length;
                const secondCount = secondLine.split(sep).length;
                if (firstCount === secondCount && firstCount > 1) {
                    return 'csv';
                }
            }
        }
    }
    
    return 'text';
}

// Procesar datos
function processData() {
    const data = inputData.value.trim();
    
    if (!data) {
        showToast('Por favor, ingresa algunos datos para procesar', 'error');
        return;
    }
    
    processBtn.classList.add('loading');
    
    setTimeout(() => {
        try {
            currentData = parseData(data, currentFormat);
            displayData(currentData, currentFormat);
            enableConversionButtons();
            
            processBtn.classList.remove('loading');
            showToast('Datos procesados exitosamente');
            
        } catch (error) {
            processBtn.classList.remove('loading');
            showToast('Error al procesar los datos: ' + error.message, 'error');
        }
    }, 500);
}

// Parsear datos según formato
function parseData(data, format) {
    switch (format) {
        case 'json':
            return JSON.parse(data);
        case 'csv':
            return parseCSV(data, csvDelimiter.value);
        case 'xml':
            return parseXML(data);
        case 'excel':
            return currentData; // Ya procesado
        default:
            throw new Error('Formato no soportado');
    }
}

// Parser CSV RFC 4180
function parseCSV(csvText, delimiter = ',') {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV debe tener al menos 2 líneas');
    
    // Parsear header
    const headers = parseCSVLine(lines[0], delimiter);
    const rows = [];
    
    // Parsear filas
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = parseCSVLine(lines[i], delimiter);
            const row = {};
            
            headers.forEach((header, index) => {
                let value = values[index] || '';
                // Convertir tipos
                if (value === 'true') value = true;
                else if (value === 'false') value = false;
                else if (!isNaN(value) && value !== '') value = Number(value);
                
                row[header] = value;
            });
            
            rows.push(row);
        }
    }
    
    return rows;
}

// Parsear línea CSV con escape
function parseCSVLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i += 2;
            } else {
                inQuotes = !inQuotes;
                i++;
            }
        } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
            i++;
        } else {
            current += char;
            i++;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Parser XML
function parseXML(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        throw new Error('XML no válido');
    }
    
    return xmlToJson(xmlDoc.documentElement);
}

// Convertir XML a JSON
function xmlToJson(xml) {
    let obj = {};
    
    if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) {
        obj = xml.nodeValue.trim();
    }
    
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            
            if (item.nodeType === 3) {
                const text = item.nodeValue.trim();
                if (text) {
                    obj = text;
                }
            } else {
                if (typeof(obj[nodeName]) === "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) === "undefined") {
                        const old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
    }
    
    return obj;
}

// Mostrar datos
function displayData(data, format) {
    renderJSONTree(data);
    renderDataTable(data);
    copyViewBtn.disabled = false;
}

// Renderizar árbol JSON interactivo
function renderJSONTree(data) {
    jsonTree.innerHTML = '';
    const tree = createJSONTreeNode(data, 'root', 0);
    jsonTree.appendChild(tree);
}

// Crear nodo del árbol JSON
function createJSONTreeNode(value, key, level) {
    const container = document.createElement('div');
    container.className = 'json-node-container';
    
    if (typeof value === 'object' && value !== null) {
        const isArray = Array.isArray(value);
        const keys = isArray ? value.map((_, i) => i) : Object.keys(value);
        
        if (keys.length > 0) {
            const header = document.createElement('div');
            header.className = 'json-node-header';
            
            const toggle = document.createElement('span');
            toggle.className = 'json-toggle expanded';
            toggle.onclick = () => toggleJSONNode(toggle);
            
            const keySpan = document.createElement('span');
            keySpan.className = 'json-key';
            keySpan.textContent = key;
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'json-value';
            valueSpan.textContent = isArray ? ` [${keys.length}]` : ` {${keys.length}}`;
            
            header.appendChild(toggle);
            header.appendChild(keySpan);
            header.appendChild(valueSpan);
            container.appendChild(header);
            
            const content = document.createElement('div');
            content.className = 'json-node-content';
            
            keys.forEach(childKey => {
                const childNode = createJSONTreeNode(value[childKey], childKey, level + 1);
                content.appendChild(childNode);
            });
            
            container.appendChild(content);
        }
    } else {
        const leaf = document.createElement('div');
        leaf.className = 'json-leaf';
        
        const keySpan = document.createElement('span');
        keySpan.className = 'json-key';
        keySpan.textContent = key + ': ';
        
        const valueSpan = document.createElement('span');
        const valueType = typeof value;
        valueSpan.className = `json-${valueType}`;
        
        if (valueType === 'string') {
            valueSpan.textContent = `"${value}"`;
        } else if (value === null) {
            valueSpan.className = 'json-null';
            valueSpan.textContent = 'null';
        } else {
            valueSpan.textContent = String(value);
        }
        
        leaf.appendChild(keySpan);
        leaf.appendChild(valueSpan);
        container.appendChild(leaf);
    }
    
    return container;
}

// Toggle nodo JSON
function toggleJSONNode(toggle) {
    const content = toggle.parentElement.nextElementSibling;
    if (toggle.classList.contains('expanded')) {
        toggle.classList.remove('expanded');
        toggle.classList.add('collapsed');
        content.classList.add('json-collapsed');
    } else {
        toggle.classList.remove('collapsed');
        toggle.classList.add('expanded');
        content.classList.remove('json-collapsed');
    }
}

// Renderizar tabla de datos
function renderDataTable(data) {
    if (!Array.isArray(data) || data.length === 0) {
        dataTable.innerHTML = '<p class="text-muted">No se puede mostrar en formato tabla</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = Object.keys(data[0]);
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Body
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            const value = row[header];
            td.textContent = value === null || value === undefined ? '' : String(value);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    dataTable.innerHTML = '';
    dataTable.appendChild(table);
}

// Cambiar vista
function switchView(viewType) {
    if (viewType === 'tree') {
        treeView.classList.remove('d-none');
        tableView.classList.add('d-none');
        treeViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
    } else {
        treeView.classList.add('d-none');
        tableView.classList.remove('d-none');
        treeViewBtn.classList.remove('active');
        tableViewBtn.classList.add('active');
    }
}

// Habilitar botones de conversión
function enableConversionButtons() {
    convertToCSV.disabled = false;
    convertToJSON.disabled = false;
    convertToXML.disabled = false;
    convertToExcel.disabled = false;
    convertToSQL.disabled = false;
}

// Convertir datos
function convertData(format) {
    if (!currentData) {
        showToast('Primero debes procesar algunos datos', 'error');
        return;
    }
    
    const button = document.getElementById(`convertTo${format.toUpperCase()}`);
    button.classList.add('loading');
    
    setTimeout(() => {
        try {
            let result;
            
            switch (format) {
                case 'csv':
                    result = generateCSV(currentData, outputDelimiter.value);
                    break;
                case 'json':
                    result = JSON.stringify(currentData, null, 2);
                    break;
                case 'xml':
                    result = generateXML(currentData);
                    break;
                case 'excel':
                    // CORREGIDO: Llamar directamente a exportToExcel
                    exportToExcel(currentData, 'datos_convertidos');
                    button.classList.remove('loading');
                    showToast('Archivo Excel descargado exitosamente');
                    return; // No procesar más
            }
            
            convertedData = result;
            convertedFormat = format;
            
            conversionResult.textContent = result;
            
            button.classList.remove('loading');
            copyResultBtn.disabled = false;
            downloadBtn.disabled = false;
            
            showToast(`Convertido a ${format.toUpperCase()} exitosamente`);
            
        } catch (error) {
            button.classList.remove('loading');
            showToast('Error en la conversión: ' + error.message, 'error');
        }
    }, 500);
}

// Generar CSV
function generateCSV(data, delimiter = ',') {
    if (!Array.isArray(data)) {
        throw new Error('Los datos deben ser un array para convertir a CSV');
    }
    
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvLines = [];
    
    // Headers
    csvLines.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(delimiter));
    
    // Rows
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvLines.push(values.join(delimiter));
    });
    
    return csvLines.join('\n');
}

// Generar XML
function generateXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (Array.isArray(data)) {
        xml += '<root>\n';
        data.forEach((item, index) => {
            xml += `  <item index="${index}">\n`;
            xml += objectToXML(item, '    ');
            xml += '  </item>\n';
        });
        xml += '</root>';
    } else if (typeof data === 'object') {
        xml += '<root>\n';
        xml += objectToXML(data, '  ');
        xml += '</root>';
    } else {
        xml += `<root>${escapeXml(String(data))}</root>`;
    }
    
    return xml;
}

// Objeto a XML
function objectToXML(obj, indent = '') {
    let xml = '';
    
    for (const [key, value] of Object.entries(obj)) {
        const cleanKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
        
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                xml += `${indent}<${cleanKey} index="${index}">\n`;
                if (typeof item === 'object') {
                    xml += objectToXML(item, indent + '  ');
                } else {
                    xml += `${indent}  ${escapeXml(String(item))}\n`;
                }
                xml += `${indent}</${cleanKey}>\n`;
            });
        } else if (typeof value === 'object' && value !== null) {
            xml += `${indent}<${cleanKey}>\n`;
            xml += objectToXML(value, indent + '  ');
            xml += `${indent}</${cleanKey}>\n`;
        } else {
            xml += `${indent}<${cleanKey}>${escapeXml(String(value))}</${cleanKey}>\n`;
        }
    }
    
    return xml;
}

// Escapar XML
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// CORREGIDO: Exportar a Excel
function exportToExcel(data, filename) {
    try {
        if (!Array.isArray(data)) {
            throw new Error('Los datos deben ser un array para convertir a Excel');
        }
        
        // Verificar que XLSX esté disponible
        if (typeof XLSX === 'undefined') {
            throw new Error('Librería XLSX no está cargada');
        }
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Datos");
        
        // Descargar directamente
        XLSX.writeFile(wb, `${filename}.xlsx`);
        
    } catch (error) {
        showToast('Error al exportar a Excel: ' + error.message, 'error');
        throw error;
    }
}

// Mostrar modal SQL
function showSQLModal() {
    if (!currentData) {
        showToast('Primero debes procesar algunos datos', 'error');
        return;
    }
    
    updateSQLPreview();
    const modal = new bootstrap.Modal(sqlModal);
    modal.show();
}

// Actualizar vista previa SQL
function updateSQLPreview() {
    if (!currentData) return;
    
    try {
        const sql = generateSQLForPreview(currentData, tableName.value, {
            includeDrop: includeDropTable.checked,
            includeCreate: includeCreateTable.checked
        });
        
        sqlPreview.textContent = sql;
    } catch (error) {
        sqlPreview.textContent = 'Error: ' + error.message;
    }
}

// CORREGIDO: Generar SQL para vista previa
function generateSQLForPreview(data, table, options = {}) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Los datos deben ser un array no vacío para generar SQL');
    }
    
    const tableName = table || 'datos';
    const headers = Object.keys(data[0]);
    let sql = '';
    
    // DROP TABLE
    if (options.includeDrop) {
        sql += `DROP TABLE IF EXISTS ${tableName};\n\n`;
    }
    
    // CREATE TABLE
    if (options.includeCreate) {
        sql += `CREATE TABLE ${tableName} (\n`;
        sql += headers.map(header => {
            const sampleValue = data[0][header];
            let type = 'TEXT';
            
            if (typeof sampleValue === 'number') {
                type = Number.isInteger(sampleValue) ? 'INTEGER' : 'REAL';
            } else if (typeof sampleValue === 'boolean') {
                type = 'BOOLEAN';
            }
            
            return `    ${header} ${type}`;
        }).join(',\n');
        sql += '\n);\n\n';
    }
    
    // INSERT statements (solo los primeros 3 para vista previa)
    const previewData = data.slice(0, 3);
    previewData.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            
            if (value === null || value === undefined) {
                return 'NULL';
            } else if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`;
            } else if (typeof value === 'boolean') {
                return value ? '1' : '0';
            } else {
                return String(value);
            }
        });
        
        sql += `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});\n`;
    });
    
    if (data.length > 3) {
        sql += `-- ... y ${data.length - 3} filas más\n`;
    }
    
    return sql;
}

// CORREGIDO: Generar y descargar SQL
function generateAndDownloadSQL() {
    try {
        if (!currentData) {
            showToast('No hay datos para generar SQL', 'error');
            return;
        }
        
        const sql = generateFullSQL(currentData, tableName.value, {
            includeDrop: includeDropTable.checked,
            includeCreate: includeCreateTable.checked
        });
        
        convertedData = sql;
        convertedFormat = 'sql';
        
        conversionResult.textContent = sql;
        copyResultBtn.disabled = false;
        downloadBtn.disabled = false;
        
        // Cerrar modal
        const modalInstance = bootstrap.Modal.getInstance(sqlModal);
        if (modalInstance) {
            modalInstance.hide();
        }
        
        showToast('SQL generado exitosamente');
        
    } catch (error) {
        showToast('Error al generar SQL: ' + error.message, 'error');
    }
}

// Generar SQL completo
function generateFullSQL(data, table, options = {}) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Los datos deben ser un array no vacío para generar SQL');
    }
    
    const tableName = table || 'datos';
    const headers = Object.keys(data[0]);
    let sql = '';
    
    // DROP TABLE
    if (options.includeDrop) {
        sql += `DROP TABLE IF EXISTS ${tableName};\n\n`;
    }
    
    // CREATE TABLE
    if (options.includeCreate) {
        sql += `CREATE TABLE ${tableName} (\n`;
        sql += headers.map(header => {
            const sampleValue = data[0][header];
            let type = 'TEXT';
            
            if (typeof sampleValue === 'number') {
                type = Number.isInteger(sampleValue) ? 'INTEGER' : 'REAL';
            } else if (typeof sampleValue === 'boolean') {
                type = 'BOOLEAN';
            }
            
            return `    ${header} ${type}`;
        }).join(',\n');
        sql += '\n);\n\n';
    }
    
    // INSERT statements
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            
            if (value === null || value === undefined) {
                return 'NULL';
            } else if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`;
            } else if (typeof value === 'boolean') {
                return value ? '1' : '0';
            } else {
                return String(value);
            }
        });
        
        sql += `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});\n`;
    });
    
    return sql;
}

// Copiar datos de vista
function copyViewData() {
    const text = treeView.classList.contains('d-none') ? 
        dataTable.textContent : jsonTree.textContent;
    
    copyToClipboard(text, 'Contenido copiado al portapapeles');
}

// Copiar resultado
function copyResultData() {
    copyToClipboard(conversionResult.textContent, 'Resultado copiado al portapapeles');
}

// Descargar archivo convertido
function downloadConvertedFile() {
    if (!convertedData || !convertedFormat) return;
    
    let blob;
    let filename;
    
    switch (convertedFormat) {
        case 'json':
            blob = new Blob([convertedData], {type: 'application/json'});
            filename = 'converted_data.json';
            break;
        case 'csv':
            blob = new Blob([convertedData], {type: 'text/csv'});
            filename = 'converted_data.csv';
            break;
        case 'xml':
            blob = new Blob([convertedData], {type: 'application/xml'});
            filename = 'converted_data.xml';
            break;
        case 'sql':
            blob = new Blob([convertedData], {type: 'text/sql'});
            filename = 'converted_data.sql';
            break;
        default:
            return;
    }
    
    downloadFile(blob, filename);
    showToast('Archivo descargado exitosamente');
}

// Descargar archivo
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Copiar al portapapeles
async function copyToClipboard(text, message) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(message);
        
        // Efecto visual
        event.target.classList.add('copy-success');
        setTimeout(() => {
            event.target.classList.remove('copy-success');
        }, 600);
        
    } catch (err) {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showToast(message);
    }
}

// Limpiar todo
function clearAll() {
    inputData.value = '';
    fileInput.value = '';
    detectedFormat.value = '';
    jsonTree.innerHTML = 'Ningún dato procesado aún...';
    dataTable.innerHTML = '';
    conversionResult.textContent = 'Resultado aparecerá aquí después de la conversión...';
    
    currentData = null;
    currentFormat = null;
    convertedData = null;
    convertedFormat = null;
    
    // Deshabilitar botones
    convertToCSV.disabled = true;
    convertToJSON.disabled = true;
    convertToXML.disabled = true;
    convertToExcel.disabled = true;
    convertToSQL.disabled = true;
    downloadBtn.disabled = true;
    copyViewBtn.disabled = true;
    copyResultBtn.disabled = true;
    
    showToast('Datos limpiados');
}

// Mostrar toast
function showToast(message, type = 'success') {
    const toast = new bootstrap.Toast(toastEl);
    const toastHeader = toastEl.querySelector('.toast-header');
    const icon = toastHeader.querySelector('i');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
        icon.className = 'bi bi-exclamation-triangle-fill text-danger me-2';
        toastHeader.querySelector('strong').textContent = 'Error';
    } else {
        icon.className = 'bi bi-check-circle-fill text-success me-2';
        toastHeader.querySelector('strong').textContent = 'Éxito';
    }
    
    toast.show();
}
