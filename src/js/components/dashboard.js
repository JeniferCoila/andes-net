export default () => {
  class Dashboard {
    constructor() {
      this.datosString = JSON.parse(localStorage.getItem("register"));
      this.btnExport = document.querySelector(".andesnet-dashboard-btn-export");
      if (!this.datosString) {
        alert("Ingrese información para llenar la tabla");
        window.location.href = "/";
      }

      this.lastId = 0;
      this.rowDataAux = this.datosString.length > 0 ? this.datosString : [];
      this.gridOptions = {
        rowData: this.rowDataAux,
        columnDefs: [
          {
            headerName: "Id",
            editable: false,
            valueGetter: (param) => {
              return this.correlativoValueGetter(param);
            },
          },
          {
            field: "client_id",
            headerName: "Dni cliente",
            editable: false,
          },
          {
            field: "phone",
            headerName: "Celular",
          },
          {
            headerName: "Fecha de registro",
            valueGetter: (param) => {
              const fech = this.obtenerFechaActual(
                param.data.dateRegister * 1000
              );
              return this.convertirFecha(fech);
            },
            editable: false,
          },
          {
            field: "velocity",
            headerName: "Velocidad",
          },
          {
            field: "plan_price",
            headerName: "Precio del plan",
          },
          {
            field: "plan_prom_price",
            headerName: "Precio promoción del plan",
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
                "Internet 100% Fibra 800 Mbps",
              ],
            },
            minWidth: 300,
          },
          {
            headerName: "Acciones",
            cellRenderer: this.actionsCellRenderer.bind(this),
            filter: false,
            sorted: false,
            editable: false,
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
        onGridReady: this.onGridReady.bind(this),
      };
      this.gridApi;
      agGrid.createGrid(document.querySelector("#myGrid"), this.gridOptions);
    }

    correlativoValueGetter(params) {
        return params.node.rowIndex + 1; 
    }

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.gridApi.refreshCells();

    }

    actionsCellRenderer(params) {
      const _this = this;
      let container = document.createElement("div");
      container.className = "d-flex justify-content-around mt-1";

      let editButton = document.createElement("button");
      editButton.className = "btn btn-warning btn-sm";
      editButton.type = "button";
      editButton.innerHTML = "Editar";
      editButton.addEventListener("click", () => {
        _this.gridApi.setFocusedCell(params.rowIndex, "plan_name");
        _this.gridApi.startEditingCell({
          rowIndex: params.rowIndex,
          colKey: "plan_name",
        });

        container.innerHTML = "";

        let saveButton = document.createElement("button");
        saveButton.className = "btn btn-success btn-sm";
        saveButton.type = "button";
        saveButton.innerHTML = "Guardar";
        saveButton.addEventListener("click", () => {
          if (_this.gridApi) {
            _this.gridApi.stopEditing();
            container.innerHTML = "";
            container.appendChild(editButton);
            container.appendChild(deleteButton);
          } else {
            console.error("Grid API no está disponible");
          }
        });
        container.appendChild(saveButton);
      });

      let deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.type = "button";
      deleteButton.innerHTML = "Eliminar";
      deleteButton.addEventListener("click", () => {
        if (_this.gridApi) {
          _this.gridApi.applyTransactionAsync({ remove: [params.node.data] });
        } else {
          console.error("Grid API no está disponible");
        }
      });

      setTimeout(() => {}, 1000);

      container.appendChild(editButton);
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
      const partes = fecha.split("-");
      const año = partes[0];
      const mes = partes[1];
      const dia = partes[2];
      const fechaFormateada = `${dia}/${mes}/${año}`;
      return fechaFormateada;
    }

    obtenerFechaActual(fechaAux) {
      const fecha = fechaAux === undefined ? new Date() : new Date(fechaAux);
      const año = fecha.getFullYear();
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      const dia = fecha.getDate().toString().padStart(2, "0");
      return `${año}-${mes}-${dia}`;
    }


    async exportTableToExcel() {
      const fontPrincipal = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: "ffffff" },
      };
      const centeredHeader = { vertical: "middle", horizontal: "center" };
      const headerFill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "03318C" },
      };
      let positionTable = 3;

      const jsonData = this.rowDataAux;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Datos");

      worksheet.getCell(`A1`).value = "ANDESNET";
      worksheet.getCell(`A1`).font = {
        name: "Arial",
        size: 16,
        bold: true,
        color: { argb: "000000" },
      };

      function setHeaderProperties(cell) {
        cell.font = fontPrincipal;
        cell.alignment = centeredHeader;
        cell.fill = headerFill;
      }

      //   setHeaderProperties(cell);

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
      worksheet.getCell(`G${positionTable}`).value =
        "Precio Promoción del Plan";

      setHeaderProperties(worksheet.getCell(`H${positionTable}`));
      worksheet.getCell(`H${positionTable}`).value = "Nombre del Plan";

      positionTable += 1;
      let correlativo = 1;
      jsonData.forEach((item) => {
        worksheet.addRow(item);
        worksheet.getCell(`A${positionTable + item}`).value = correlativo++;
        worksheet.getCell(`A${positionTable + item}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        worksheet.getCell(`B${positionTable + item}`).value = item.client_id;
        worksheet.getCell(`B${positionTable + item}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        worksheet.getCell(`C${positionTable + item}`).value = item.phone;
        worksheet.getCell(`C${positionTable + item}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        worksheet.getCell(`D${positionTable + item}`).value =
          this.convertirFecha(
            this.obtenerFechaActual(new Date(item.dateRegister) * 1000)
          );
        worksheet.getCell(`D${positionTable + item}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        worksheet.getCell(`E${positionTable + item}`).value = item.velocity;
        worksheet.getCell(`E${positionTable + item}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        worksheet.getCell(`F${positionTable + item}`).value = Number(
          item.plan_price
        ).toFixed(2);
        worksheet.getCell(`F${positionTable + item}`).alignment = {
          vertical: "middle",
          horizontal: "right",
        };

        worksheet.getCell(`G${positionTable + item}`).value = Number(
          item.plan_prom_price
        ).toFixed(2);
        worksheet.getCell(`G${positionTable + item}`).alignment = {
          vertical: "middle",
          horizontal: "right",
        };

        worksheet.getCell(`H${positionTable + item}`).value = item.plan_name;
        worksheet.getCell(`H${positionTable + item}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

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

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Andesnet.xlsx";
        link.click();
      });
    }

    /*Guardar*/
    init() {
      const _this = this;
      const guardarBtn = document.querySelector(".btn-success");

      guardarBtn.addEventListener("click", () => {
        const dni = document.getElementById("dniInput").value;
        const celular = document.getElementById("celularInput").value;
        const planes = document.getElementById("planesSelect").value;

        if (!_this.validar(dni, celular, planes)) {
          return;
        }
        const newData = {
          id_register: ++_this.lastId,
          client_id: dni,
          phone: celular,
          dateRegister: new Date() / 1000,
          velocity: "",
          plan_price: "",
          plan_prom_price: "",
          plan_name: planes,
        };

        _this.rowDataAux.push(newData);
        _this.gridApi.setRowData(_this.rowDataAux);
        document.getElementById("dniInput").value = "";
        document.getElementById("celularInput").value = "";
        document.getElementById("planesSelect").value = "1";
      });

      this.btnExport.addEventListener("click", () => {
        _this.exportTableToExcel();
      });
    }
  }

  new Dashboard().init();
};
