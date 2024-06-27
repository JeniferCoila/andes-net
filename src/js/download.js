async function fetchJsonData() {
    const response = await fetch('/js/data/cards-content.json');
    const data = await response.json();
    return data;
}

async function exportToExcel() {
    const fontPrincipal = { name: "Arial", size: 12, bold: true, color: { argb: "ffffff" } };
    const centeredHeader = { vertical: "middle", horizontal: "center" };
    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '03318C' } };
    let positionTable = 3;

    const jsonData = await fetchJsonData();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    worksheet.getCell(`A1`).value = "ANDESNET";
    worksheet.getCell(`A1`).font = { name: "Arial", size: 16, bold: true, color: { argb: "000000" } }

    function setHeaderProperties(cell) {
        cell.font = fontPrincipal;
        cell.alignment = centeredHeader;
        cell.fill = headerFill;
    }

    setHeaderProperties(worksheet.getCell(`A${positionTable}`));
    worksheet.getCell(`A${positionTable}`).value = "Título";

    setHeaderProperties(worksheet.getCell(`B${positionTable}`));
    worksheet.getCell(`B${positionTable}`).value = "Velocidad";

    setHeaderProperties(worksheet.getCell(`C${positionTable}`));
    worksheet.getCell(`C${positionTable}`).value = "Promoción disponible";

    setHeaderProperties(worksheet.getCell(`D${positionTable}`));
    worksheet.getCell(`D${positionTable}`).value = "Promoción velocidad";

    setHeaderProperties(worksheet.getCell(`E${positionTable}`));
    worksheet.getCell(`E${positionTable}`).value = "Meses";

    setHeaderProperties(worksheet.getCell(`F${positionTable}`));
    worksheet.getCell(`F${positionTable}`).value = "Precio";

    setHeaderProperties(worksheet.getCell(`G${positionTable}`));
    worksheet.getCell(`G${positionTable}`).value = "Promoción precio";

    positionTable += 1;
    jsonData.forEach(item => {
        worksheet.addRow(item);
        worksheet.getCell(`A${positionTable + item}`).value = item.title;

        worksheet.getCell(`B${positionTable + item}`).value = item.vel;
        worksheet.getCell(`B${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        worksheet.getCell(`C${positionTable + item}`).value = item.prom_enabled ? "Disponible" : "No disponible";

        worksheet.getCell(`D${positionTable + item}`).value = item.promocional_vel;
        worksheet.getCell(`D${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        worksheet.getCell(`E${positionTable + item}`).value = item.months;
        worksheet.getCell(`E${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        worksheet.getCell(`F${positionTable + item}`).value = Number(item.price).toFixed(2);
        worksheet.getCell(`F${positionTable + item}`).alignment = { vertical: "middle", horizontal: "right" };

        worksheet.getCell(`G${positionTable + item}`).value = Number(item.prom_price).toFixed(2);
        worksheet.getCell(`G${positionTable + item}`).alignment = { vertical: "middle", horizontal: "right" };

        positionTable++;
    });

    worksheet.getColumn("A").width = 40;
    worksheet.getColumn("B").width = 20;
    worksheet.getColumn("C").width = 30;
    worksheet.getColumn("D").width = 40;
    worksheet.getColumn("E").width = 20;
    worksheet.getColumn("F").width = 25;
    worksheet.getColumn("G").width = 25;

    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Andesnet.xlsx';
        link.click();
    });
}