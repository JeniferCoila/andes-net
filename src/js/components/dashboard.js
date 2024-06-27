const datosString = JSON.parse(localStorage.getItem('register'));

if (!datosString) {
    alert("Ingrese información para llenar la tabla")
    window.location.href = '/';
}

let lastId = 1;
let gridApi;
rowDataAux = datosString.length > 0 ? datosString : [];
const gridOptions = {
    rowData: rowDataAux,
    columnDefs: [
        {
            headerName: "Id",
            editable: false,
            valueGetter: () => {
                return lastId;
            },
        },
        {
            field: "client_id",
            headerName: "Dni cliente",
            editable: false
        },
        {
            field: "phone",
            headerName: "Celular"
        },
        {
            headerName: "Fecha de registro",
            valueGetter: (param) => {
                const fech = obtenerFechaActual(param.data.dateRegister * 1000);
                return convertirFecha(fech);
            },
            editable: false
        },
        {
            field: "velocity",
            headerName: "Velocidad"
        },
        {
            field: "plan_price",
            headerName: "Precio del plan"
        },
        {
            field: "plan_prom_price",
            headerName: "Precio promoción del plan"
        },
        {
            field: "plan_name",
            headerName: "Nombre del plan",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: [
                    "Internet 100% Fibra Promocional 100 Mbps",
                    "Internet 100% Fibra Promocional 200 Mbps",
                    "Internet 100% Fibra Promocional 300 Mbps",
                    "Internet 100% Fibra Promocional 400 Mbps",
                    "Internet 100% Fibra 600 Mbps",
                    "Internet 100% Fibra 800 Mbps"
                ],
            },
            minWidth: 300,
        },
        {
            headerName: "Acciones",
            cellRenderer: actionsCellRenderer,
            filter: false,
            sorted: false,
            editable: false
        },
    ],
    defaultColDef: {
        filter: "agTextColumnFilter",
        floatingFilter: true,
        editable: true,
        cellDataType: false,
        singleClickEdit: false,
    },
    editType: "fullRow",
    rowSelection: "multiple",
    suppressRowClickSelection: false,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 25, 50],
};

function actionsCellRenderer(params) {
    let container = document.createElement('div');
    container.className = 'd-flex justify-content-around mt-1';

    let editButton = document.createElement('button');
    editButton.className = 'btn btn-warning btn-sm';
    editButton.type = 'button';
    editButton.innerHTML = 'Editar';
    editButton.addEventListener('click', () => {
        gridApi.setFocusedCell(params.rowIndex, "plan_name");
        gridApi.startEditingCell({
            rowIndex: params.rowIndex,
            colKey: "plan_name",
        });

        container.innerHTML = '';

        let saveButton = document.createElement('button');
        saveButton.className = 'btn btn-success btn-sm';
        saveButton.type = 'button';
        saveButton.innerHTML = 'Guardar';
        saveButton.addEventListener('click', () => {
            gridApi.stopEditing();
            container.innerHTML = '';
            container.appendChild(editButton);
            container.appendChild(deleteButton);
        });
        container.appendChild(saveButton);
    });

    let deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.type = 'button';
    deleteButton.innerHTML = 'Eliminar';
    deleteButton.addEventListener('click', () => {
        gridApi.applyTransaction({ remove: [params.node.data] });
    });

    container.appendChild(editButton);
    container.appendChild(deleteButton);
    return container;
}

gridApi = agGrid.createGrid(document.querySelector("#myGrid"), gridOptions);

function validar(dni, celular, planes) {
    if (dni == "" || celular == "" || planes == "") {
        alert("Complete los espacios en blanco");
        return false;
    }
    return true;
}

function convertirFecha(fecha) {
    const partes = fecha.split('-');
    const año = partes[0];
    const mes = partes[1];
    const dia = partes[2];
    const fechaFormateada = `${dia}/${mes}/${año}`;
    return fechaFormateada;
}

function obtenerFechaActual(fechaAux) {
    const fecha = fechaAux === undefined ? new Date() : new Date(fechaAux);
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

function redirectLogin() {
    const userData = sessionStorage.getItem("user-andesnet");
    const route = window.location.pathname.replace("src/", "");
    console.log(!userData && route !== "/");
    if( !userData && route !== "/") {
        alert("No se ha iniciado sesión");
        window.location.href = window.location.origin + window.location.pathname.replace("views/dashboard.html","") + "#login";
    }
}

/*Guardar*/
document.addEventListener('DOMContentLoaded', () => {
    redirectLogin();
    const guardarBtn = document.querySelector('.btn-success');

    guardarBtn.addEventListener('click', () => {
        const dni = document.getElementById('dniInput').value;
        const celular = document.getElementById('celularInput').value;
        const planes = document.getElementById('planesSelect').value;

        if (!validar(dni, celular, planes)) {
            return;
        }

        const newData = {
            id_register: ++lastId,
            client_id: dni,
            phone: celular,
            dateRegister: new Date() / 1000,
            velocity: '',
            plan_price: '',
            plan_prom_price: '',
            plan_name: planes
        };

        rowDataAux.push(newData)
        gridApi.setRowData(rowDataAux);
        document.getElementById('dniInput').value = '';
        document.getElementById('celularInput').value = '';
        document.getElementById('planesSelect').value = '1';
    });
});


async function exportTableToExcel() {
    const fontPrincipal = { name: "Arial", size: 12, bold: true, color: { argb: "ffffff" } };
    const centeredHeader = { vertical: "middle", horizontal: "center" };
    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '03318C' } };
    let positionTable = 3;

    const jsonData = rowDataAux;
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
    worksheet.getCell(`A${positionTable}`).value = "Item";

    setHeaderProperties(worksheet.getCell(`B${positionTable}`));
    worksheet.getCell(`B${positionTable}`).value = "DNI Cliente";

    setHeaderProperties(worksheet.getCell(`C${positionTable}`));
    worksheet.getCell(`C${positionTable}`).value = "Celular";

    setHeaderProperties(worksheet.getCell(`D${positionTable}`));
    worksheet.getCell(`D${positionTable}`).value = "Fecha de registro";

    setHeaderProperties(worksheet.getCell(`E${positionTable}`));
    worksheet.getCell(`E${positionTable}`).value = "Velocidad";

    setHeaderProperties(worksheet.getCell(`F${positionTable}`));
    worksheet.getCell(`F${positionTable}`).value = "Precio del Plan";

    setHeaderProperties(worksheet.getCell(`G${positionTable}`));
    worksheet.getCell(`G${positionTable}`).value = "Precio Promoción del Plan";

    setHeaderProperties(worksheet.getCell(`H${positionTable}`));
    worksheet.getCell(`H${positionTable}`).value = "Nombre del Plan";

    positionTable += 1;
    correlativo = 1;
    jsonData.forEach(item => {
        worksheet.addRow(item);
        worksheet.getCell(`A${positionTable + item}`).value = correlativo++;
        worksheet.getCell(`A${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        worksheet.getCell(`B${positionTable + item}`).value = item.client_id;
        worksheet.getCell(`B${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        worksheet.getCell(`C${positionTable + item}`).value = item.phone;
        worksheet.getCell(`C${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        worksheet.getCell(`D${positionTable + item}`).value = convertirFecha(obtenerFechaActual(new Date(item.dateRegister) * 1000));
        worksheet.getCell(`D${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        worksheet.getCell(`E${positionTable + item}`).value = item.velocity;
        worksheet.getCell(`E${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        worksheet.getCell(`F${positionTable + item}`).value = Number(item.plan_price).toFixed(2);
        worksheet.getCell(`F${positionTable + item}`).alignment = { vertical: "middle", horizontal: "right" };

        worksheet.getCell(`G${positionTable + item}`).value = Number(item.plan_prom_price).toFixed(2);
        worksheet.getCell(`G${positionTable + item}`).alignment = { vertical: "middle", horizontal: "right" };

        worksheet.getCell(`H${positionTable + item}`).value = item.plan_name;
        worksheet.getCell(`H${positionTable + item}`).alignment = { vertical: "middle", horizontal: "center" };

        positionTable++;
    });

    worksheet.getColumn("A").width = 10;
    worksheet.getColumn("B").width = 20;
    worksheet.getColumn("C").width = 30;
    worksheet.getColumn("D").width = 40;
    worksheet.getColumn("E").width = 20;
    worksheet.getColumn("F").width = 35;
    worksheet.getColumn("G").width = 50;
    worksheet.getColumn("H").width = 80;

    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Andesnet.xlsx';
        link.click();
    });
}