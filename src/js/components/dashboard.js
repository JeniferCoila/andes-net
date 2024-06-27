const datosString = JSON.parse(localStorage.getItem('register'));

if (!datosString) {
    alert("Ingrese información para llenar la tabla")
    window.location.href = '/';
}

let lastId = 1;
let gridApi;
const gridOptions = {
    rowData: [],
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

gridOptions.rowData = datosString;
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

/*Guardar*/
document.addEventListener('DOMContentLoaded', () => {
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

        gridApi.applyTransaction({ add: [newData] });
        document.getElementById('dniInput').value = '';
        document.getElementById('celularInput').value = '';
        document.getElementById('planesSelect').value = '1';
    });
});