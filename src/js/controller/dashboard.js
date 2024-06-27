const datosString = localStorage.getItem('datosParaVentanaNueva');
console.log(datosString);

if (!datosString) {
    //window.location.href = '/login.html';
}

async function fetchJsonData() {
    const response = await fetch('/src/js/data/users-content.json');
    const data = await response.json();
    return data;
}

let lastId = 0;
let gridApi;
const gridOptions = {
    rowData: [],
    columnDefs: [
        {
            field: "id_register",
            headerName: "Id"
        },
        {
            field: "client_id",
            headerName: "Dni cliente"
        },
        {
            field: "phone",
            headerName: "Celular"
        },
        {
            headerName: "Fecha de registro",
            valueGetter: (param) => convertirFecha(param.data.dateRegister)
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
            editable: true,
            flex: 1,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: [
                    "Velocidad 100 % FIBRA",
                    "Velocidad 200 % FIBRA",
                    "Velocidad 300 % FIBRA",
                    "Velocidad 400 % FIBRA",
                    "Velocidad 600 % FIBRA",
                    "Velocidad 800 % FIBRA"
                ],
            },
        },
        {
            headerName: "Acciones",
            cellRenderer: actionsCellRenderer,
            filter: false,
            sorted: false,
        },
    ],
    defaultColDef: {
        filter: "agTextColumnFilter",
        floatingFilter: true,
    },
    rowSelection: "multiple",
    suppressRowClickSelection: true,
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
    });
    container.appendChild(editButton);

    let deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.type = 'button';
    deleteButton.innerHTML = 'Eliminar';
    deleteButton.addEventListener('click', () => {
        gridApi.applyTransaction({ remove: [params.node.data] });
    });
    container.appendChild(deleteButton);
    return container;
}

data = fetchJsonData().then((data) => {
    if (data.length > 0) {
        gridOptions.rowData = data;
        lastId = data[data.length - 1].id_register;
    }
    gridApi = agGrid.createGrid(document.querySelector("#myGrid"), gridOptions);
});

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

function obtenerFechaActual() {
    const fecha = new Date();
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
            dateRegister: obtenerFechaActual(),
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