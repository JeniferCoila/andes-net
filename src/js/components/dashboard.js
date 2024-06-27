
export default () => {

    class Dashboard {
        constructor() {
            this.datosString = localStorage.getItem('datosParaVentanaNueva');
            if (!this.datosString) {
                //window.location.href = '/login.html';
            }

            this.lastId = 0;
            this.gridApi;
            this.gridOptions;
        }
        
        async fetchJsonData() {
            const response = await fetch('/src/js/data/users-content.json');
            const data = await response.json();
            return data;
        }

        
        actionsCellRenderer(params) {
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
                this.gridApi.applyTransaction({ remove: [params.node.data] });
            });
            container.appendChild(deleteButton);
            return container;
        }
        
        validar(dni, celular, planes) {
            if (dni == "" || celular == "" || planes == "") {
                alert("Complete los espacios en blanco");
                return false;
            }
            return true;
        }
        
        convertirFecha(fecha) {
            const partes = fecha.split('-');
            const año = partes[0];
            const mes = partes[1];
            const dia = partes[2];
            const fechaFormateada = `${dia}/${mes}/${año}`;
            return fechaFormateada;
        }
        
        obtenerFechaActual() {
            const fecha = new Date();
            const año = fecha.getFullYear();
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const dia = fecha.getDate().toString().padStart(2, '0');
            return `${año}-${mes}-${dia}`;
        }

        load(){
            const guardarBtn = document.querySelector('.btn-success');
        
            guardarBtn.addEventListener('click', () => {
                const dni = document.getElementById('dniInput').value;
                const celular = document.getElementById('celularInput').value;
                const planes = document.getElementById('planesSelect').value;
        
                if (!this.validar(dni, celular, planes)) {
                    return;
                }

                const newData = {
                    id_register: ++this.lastId,
                    client_id: dni,
                    phone: celular,
                    dateRegister: this.obtenerFechaActual(),
                    velocity: '',
                    plan_price: '',
                    plan_prom_price: '',
                    plan_name: planes
                };

                this.gridApi.applyTransaction({ add: [newData] });
                document.getElementById('dniInput').value = '';
                document.getElementById('celularInput').value = '';
                document.getElementById('planesSelect').value = '1';
            });
        }

        init() {
            
            this.fetchJsonData().then((data) => {
                this.gridApi = agGrid.createGrid(document.querySelector("#myGrid"), this.gridOptions);
                if (data.length > 0) {
                    this.gridOptions.rowData = data;
                    this.lastId = data[data.length - 1].id_register;
                }
            });
            this.gridOptions = {
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
                        valueGetter: (param) => this.convertirFecha(param.data.dateRegister)
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
                        cellRenderer: this.actionsCellRenderer,
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
            this.load();
        }
    
    }
    new Dashboard().init();
}

